<?php

namespace App\Repositories\Card;

use App\Models\Card;
use App\Repositories\Card\DTOs\AdminCardDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CardCrudRepositoryInterface
{
    public function paginate(int $page, ?int $deckId, ?string $search): LengthAwarePaginator;

    public function find(int $id): ?Card;

    public function create(array $data): Card;

    public function update(Card $card, array $data): Card;

    public function delete(Card $card): void;

    public function toDto(Card $card): AdminCardDto;
}
