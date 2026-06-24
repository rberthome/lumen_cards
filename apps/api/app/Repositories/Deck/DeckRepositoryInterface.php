<?php

namespace App\Repositories\Deck;

use App\Repositories\Deck\DTOs\CreateDeckDto;
use App\Repositories\Deck\DTOs\DeckDto;
use Illuminate\Support\Collection;

interface DeckRepositoryInterface
{
    /** @return Collection<int, DeckDto> */
    public function findForUser(int $userId): Collection;

    public function findById(int $deckId, int $userId): DeckDto;

    public function create(int $userId, CreateDeckDto $dto): DeckDto;
}
