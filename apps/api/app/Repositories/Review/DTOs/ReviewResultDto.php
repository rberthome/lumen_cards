<?php

namespace App\Repositories\Review\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class ReviewResultDto implements ArrayableDto
{
    public function __construct(
        public int $xp_earned,
        public float $accuracy,
        public int $cards_reviewed,
        public int $duration_ms,
        public int $streak_days,
        public string $level,
    ) {}

    public function toArray(): array
    {
        return [
            'xp_earned'      => $this->xp_earned,
            'accuracy'       => $this->accuracy,
            'cards_reviewed' => $this->cards_reviewed,
            'duration_ms'    => $this->duration_ms,
            'streak_days'    => $this->streak_days,
            'level'          => $this->level,
        ];
    }
}
