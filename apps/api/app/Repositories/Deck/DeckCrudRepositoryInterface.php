<?php

namespace App\Repositories\Deck;

use App\Models\Deck;
use App\Repositories\Deck\DTOs\AdminDeckDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface DeckCrudRepositoryInterface
{
    public function paginate(int $page, ?string $search, ?int $categoryId): LengthAwarePaginator;

    public function find(int $id): ?Deck;

    public function create(array $data): Deck;

    public function update(Deck $deck, array $data): Deck;

    public function delete(Deck $deck): void;

    public function publish(Deck $deck, bool $published): Deck;

    public function toDto(Deck $deck): AdminDeckDto;
}
