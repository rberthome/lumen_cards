<?php

namespace App\Services;

use Carbon\Carbon;

class SM2Service
{
    /**
     * Calculate next SM-2 interval.
     *
     * q=4 for knew=true, q=1 for knew=false.
     */
    public function calculate(int $repetition, float $easeFactor, int $interval, int $q): array
    {
        if ($q >= 3) {
            $newInterval = match ($repetition) {
                0       => 1,
                1       => 6,
                default => (int) round($interval * $easeFactor),
            };
            $newRepetition = $repetition + 1;
            $newEaseFactor = max(1.3, $easeFactor + 0.1 - (5 - $q) * (0.08 + (5 - $q) * 0.02));
        } else {
            $newInterval   = 1;
            $newRepetition = 0;
            $newEaseFactor = max(1.3, $easeFactor - 0.2);
        }

        return [
            'interval'       => $newInterval,
            'repetition'     => $newRepetition,
            'ease_factor'    => round($newEaseFactor, 4),
            'next_review_at' => Carbon::now()->addDays($newInterval),
        ];
    }
}
