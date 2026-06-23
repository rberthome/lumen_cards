<?php

namespace App\Repositories\Card;

use App\Repositories\Card\DTOs\CardWithProgressDto;
use Illuminate\Support\Collection;

interface CardRepositoryInterface
{
    /**
     * @return Collection<int, CardWithProgressDto>
     */
    public function findDueForReview(int $userId, int $deckId, int $limit): Collection;
}
