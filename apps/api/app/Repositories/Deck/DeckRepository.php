<?php

namespace App\Repositories\Deck;

use App\Models\CardProgress;
use App\Models\Deck;
use App\Repositories\Deck\DTOs\CreateDeckDto;
use App\Repositories\Deck\DTOs\DeckDto;
use Illuminate\Support\Collection;

readonly class DeckRepository implements DeckRepositoryInterface
{
    public function findForUser(int $userId): Collection
    {
        $decks = Deck::where(function ($q) use ($userId) {
            $q->whereNull('user_id')->orWhere('user_id', $userId);
        })->withCount('cards')->get();

        return $decks->map(fn (Deck $deck) => $this->toDto($deck, $userId));
    }

    public function findById(int $deckId, int $userId): DeckDto
    {
        $deck = Deck::withCount('cards')->findOrFail($deckId);

        return $this->toDto($deck, $userId);
    }

    public function create(int $userId, CreateDeckDto $dto): DeckDto
    {
        $deck = Deck::create([
            'user_id'     => $userId,
            'title'       => $dto->title,
            'description' => $dto->description,
            'category'    => $dto->category,
            'cover_emoji' => $dto->cover_emoji,
        ]);
        $deck->loadCount('cards');

        return $this->toDto($deck, $userId);
    }

    private function toDto(Deck $deck, int $userId): DeckDto
    {
        $dueToday = CardProgress::whereHas('card', fn ($q) => $q->where('deck_id', $deck->id))
            ->where('user_id', $userId)
            ->where('next_review_at', '<=', now())
            ->count();

        return new DeckDto(
            id: $deck->id,
            user_id: $deck->user_id,
            title: $deck->title,
            description: $deck->description,
            category: $deck->category->value,
            card_count: $deck->cards_count ?? 0,
            due_today: $dueToday,
            cover_emoji: $deck->cover_emoji,
            created_at: $deck->created_at->toISOString(),
        );
    }
}
