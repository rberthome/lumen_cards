<?php

namespace App\Repositories\Stat;

use App\Enums\UserLevel;
use App\Models\CardProgress;
use App\Models\UserStat;
use App\Repositories\Stat\DTOs\UserStatDto;

readonly class StatRepository implements StatRepositoryInterface
{
    public function findForUser(int $userId): UserStatDto
    {
        $stat = UserStat::firstOrCreate(
            ['user_id' => $userId],
            ['xp' => 0, 'streak_days' => 0, 'total_time_ms' => 0],
        );

        $totalCards  = CardProgress::where('user_id', $userId)->count();
        $mastered    = CardProgress::where('user_id', $userId)->where('repetition', '>=', 5)->count();
        $inProgress  = $totalCards - $mastered;

        $totalReviews   = CardProgress::where('user_id', $userId)->whereNotNull('last_reviewed_at')->count();
        $correctReviews = CardProgress::where('user_id', $userId)->where('repetition', '>', 0)->count();
        $accuracy       = $totalReviews > 0 ? round($correctReviews / $totalReviews, 2) : 0.0;

        $level = UserLevel::fromXp($stat->xp);

        return new UserStatDto(
            total_cards: $totalCards,
            mastered: $mastered,
            in_progress: $inProgress,
            accuracy: $accuracy,
            streak_days: $stat->streak_days,
            total_time_ms: $stat->total_time_ms,
            level: $level->value,
            xp: $stat->xp,
            xp_to_next_level: $level->xpToNext(),
        );
    }
}
