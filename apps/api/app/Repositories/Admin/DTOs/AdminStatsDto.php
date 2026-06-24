<?php

namespace App\Repositories\Admin\DTOs;

readonly class AdminStatsDto
{
    public function __construct(
        public int   $total_users,
        public int   $active_today,
        public int   $total_cards_reviewed,
        public float $average_accuracy,
    ) {}

    public function toArray(): array
    {
        return [
            'total_users'          => $this->total_users,
            'active_today'         => $this->active_today,
            'total_cards_reviewed' => $this->total_cards_reviewed,
            'average_accuracy'     => $this->average_accuracy,
        ];
    }
}
