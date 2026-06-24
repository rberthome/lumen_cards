<?php

namespace App\Repositories\Deck;

use App\Models\Deck;
use App\Repositories\Deck\DTOs\AdminDeckDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DeckCrudRepository implements DeckCrudRepositoryInterface
{
    public function paginate(int $page, ?string $search, ?int $categoryId): LengthAwarePaginator
    {
        return Deck::with('category')
            ->withCount('cards')
            ->when($search, fn ($q) => $q->where('title', 'ilike', "%{$search}%"))
            ->when($categoryId, fn ($q) => $q->where('category_id', $categoryId))
            ->orderBy('created_at', 'desc')
            ->paginate(20, ['*'], 'page', $page);
    }

    public function find(int $id): ?Deck
    {
        return Deck::with('category')->withCount('cards')->find($id);
    }

    public function create(array $data): Deck
    {
        return Deck::create($data);
    }

    public function update(Deck $deck, array $data): Deck
    {
        $deck->update($data);

        return $deck->fresh('category');
    }

    public function delete(Deck $deck): void
    {
        $deck->delete();
    }

    public function publish(Deck $deck, bool $published): Deck
    {
        $deck->update(['is_published' => $published]);

        return $deck->fresh('category');
    }

    public function toDto(Deck $deck): AdminDeckDto
    {
        return new AdminDeckDto(
            id:            $deck->id,
            category_id:   $deck->category_id,
            category_name: $deck->category?->name,
            title:         $deck->title,
            description:   $deck->description,
            cover_emoji:   $deck->cover_emoji,
            is_published:  $deck->is_published,
            card_count:    $deck->cards_count ?? $deck->cards()->count(),
            created_at:    $deck->created_at->toISOString(),
        );
    }
}
