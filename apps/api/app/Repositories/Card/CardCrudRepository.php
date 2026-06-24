<?php

namespace App\Repositories\Card;

use App\Models\Card;
use App\Repositories\Card\DTOs\AdminCardDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CardCrudRepository implements CardCrudRepositoryInterface
{
    public function paginate(int $page, ?int $deckId, ?string $search): LengthAwarePaginator
    {
        return Card::with('deck')
            ->when($deckId, fn ($q) => $q->where('deck_id', $deckId))
            ->when($search, fn ($q) => $q->where('front', 'ilike', "%{$search}%"))
            ->orderBy('created_at', 'desc')
            ->paginate(20, ['*'], 'page', $page);
    }

    public function find(int $id): ?Card
    {
        return Card::with('deck')->find($id);
    }

    public function create(array $data): Card
    {
        $card = Card::create($data);

        return $card->load('deck');
    }

    public function update(Card $card, array $data): Card
    {
        $card->update($data);

        return $card->fresh('deck');
    }

    public function delete(Card $card): void
    {
        $card->delete();
    }

    public function toDto(Card $card): AdminCardDto
    {
        return new AdminCardDto(
            id:                 $card->id,
            deck_id:            $card->deck_id,
            deck_title:         $card->deck?->title ?? '',
            front:              $card->front,
            back:               $card->back,
            wrong_answer_1:     $card->wrong_answer_1,
            wrong_answer_2:     $card->wrong_answer_2,
            wrong_answer_3:     $card->wrong_answer_3,
            explanation:        $card->explanation,
            source:             $card->source,
            tags:               $card->tags ?? [],
            difficulty:         $card->difficulty->value,
            progression_config: $card->progressionConfig(),
            created_at:         $card->created_at->toISOString(),
        );
    }
}
