<?php

namespace App\Repositories\Stat\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class UserStatDto implements ArrayableDto
{
    public function __construct(
        public int $total_cards,
        public int $mastered,
        public int $in_progress,
        public float $accuracy,
        public int $streak_days,
        public int $total_time_ms,
        public string $level,
        public int $xp,
        public int $xp_to_next_level,
    ) {}

    public function toArray(): array
    {
        return [
            'total_cards'      => $this->total_cards,
            'mastered'         => $this->mastered,
            'in_progress'      => $this->in_progress,
            'accuracy'         => $this->accuracy,
            'streak_days'      => $this->streak_days,
            'total_time_ms'    => $this->total_time_ms,
            'level'            => $this->level,
            'xp'               => $this->xp,
            'xp_to_next_level' => $this->xp_to_next_level,
        ];
    }
}
