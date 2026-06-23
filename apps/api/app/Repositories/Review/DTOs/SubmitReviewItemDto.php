<?php

namespace App\Repositories\Review\DTOs;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class SubmitReviewItemDto
{
    public function __construct(
        public int $card_id,
        public bool $knew,
        public int $time_spent_ms,
    ) {}
}
