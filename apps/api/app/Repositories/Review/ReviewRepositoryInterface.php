<?php

namespace App\Repositories\Review;

use App\Repositories\Review\DTOs\ReviewResultDto;
use App\Repositories\Review\DTOs\SubmitReviewItemDto;

interface ReviewRepositoryInterface
{
    /**
     * @param SubmitReviewItemDto[] $items
     */
    public function submit(int $userId, array $items, int $totalDurationMs): ReviewResultDto;
}
