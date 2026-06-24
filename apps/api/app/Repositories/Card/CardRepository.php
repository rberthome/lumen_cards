<?php

namespace App\Repositories\Card;

use App\Models\Card;
use App\Models\CardProgress;
use App\Repositories\Card\DTOs\CardWithProgressDto;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

readonly class CardRepository implements CardRepositoryInterface
{
    public function findDueForReview(int $userId, int $deckId, int $limit): Collection
    {
        $dueCardIds = CardProgress::where('user_id', $userId)
            ->whereHas('card', fn ($q) => $q->where('deck_id', $deckId))
            ->where('next_review_at', '<=', now())
            ->pluck('card_id');

        $reviewedCardIds = CardProgress::where('user_id', $userId)
            ->whereHas('card', fn ($q) => $q->where('deck_id', $deckId))
            ->pluck('card_id');

        $neverReviewedIds = Card::where('deck_id', $deckId)
            ->whereNotIn('id', $reviewedCardIds)
            ->pluck('id');

        $allDueIds = $dueCardIds->merge($neverReviewedIds)->unique()->take($limit);

        // Always return at least 1 card — pick the least recently due when deck is fully mastered
        if ($allDueIds->isEmpty()) {
            $fallbackId = CardProgress::where('user_id', $userId)
                ->whereHas('card', fn ($q) => $q->where('deck_id', $deckId))
                ->orderBy('next_review_at')
                ->value('card_id');

            if ($fallbackId) {
                $allDueIds = collect([$fallbackId]);
            }
        }

        $cards = Card::whereIn('id', $allDueIds)->get()->keyBy('id');

        $progresses = CardProgress::where('user_id', $userId)
            ->whereIn('card_id', $allDueIds)
            ->get()
            ->keyBy('card_id');

        return $allDueIds->map(function (int $cardId) use ($cards, $progresses): CardWithProgressDto {
            $card       = $cards[$cardId];
            $progress   = $progresses[$cardId] ?? null;
            $repetition = $progress?->repetition ?? 0;
            $config     = $card->progressionConfig();
            $showChoices = $card->wrong_answer_1 !== null
                && $repetition < $config['threshold_4_choices'];

            return new CardWithProgressDto(
                id: $card->id,
                deck_id: $card->deck_id,
                front: $card->front,
                back: $card->back,
                wrong_answer_1: $card->wrong_answer_1,
                wrong_answer_2: $card->wrong_answer_2,
                wrong_answer_3: $card->wrong_answer_3,
                explanation: $card->explanation,
                source: $card->source,
                tags: $card->tags ?? [],
                difficulty: $card->difficulty->value,
                interval: $progress?->interval ?? 0,
                repetition: $repetition,
                ease_factor: $progress?->ease_factor ?? 2.5,
                next_review_at: $progress?->next_review_at?->toISOString(),
                show_choices: $showChoices,
            );
        });
    }
}
