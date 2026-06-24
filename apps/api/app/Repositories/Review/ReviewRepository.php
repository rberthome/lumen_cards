<?php

namespace App\Repositories\Review;

use App\Enums\UserLevel;
use App\Models\CardProgress;
use App\Models\ReviewSession;
use App\Models\UserStat;
use App\Repositories\Review\DTOs\ReviewResultDto;
use App\Repositories\Review\DTOs\SubmitReviewItemDto;
use App\Services\SM2Service;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

readonly class ReviewRepository implements ReviewRepositoryInterface
{
    public function __construct(
        private SM2Service $sm2,
    ) {}

    public function submit(int $userId, array $items, int $totalDurationMs): ReviewResultDto
    {
        $correctCount = 0;
        $totalXp      = 0;

        $stat = UserStat::firstOrCreate(
            ['user_id' => $userId],
            ['xp' => 0, 'streak_days' => 0, 'total_time_ms' => 0],
        );

        $streakMultiplier = match (true) {
            $stat->streak_days > 7 => 2.0,
            $stat->streak_days >= 3 => 1.5,
            default => 1.0,
        };

        DB::transaction(function () use ($userId, $items, $totalDurationMs, $stat, $streakMultiplier, &$correctCount, &$totalXp) {
            foreach ($items as $item) {
                $q        = $item->knew ? 4 : 1;
                $progress = CardProgress::firstOrNew(
                    ['user_id' => $userId, 'card_id' => $item->card_id],
                    ['interval' => 0, 'repetition' => 0, 'ease_factor' => 2.5],
                );

                $result = $this->sm2->calculate(
                    repetition: $progress->repetition,
                    easeFactor: $progress->ease_factor,
                    interval: $progress->interval,
                    q: $q,
                );

                $progress->fill([
                    'interval'         => $result['interval'],
                    'repetition'       => $result['repetition'],
                    'ease_factor'      => $result['ease_factor'],
                    'next_review_at'   => $result['next_review_at'],
                    'last_reviewed_at' => now(),
                ])->save();

                if ($item->knew) {
                    $correctCount++;
                    $totalXp += (int) round(10 * $streakMultiplier);
                } else {
                    $totalXp += 3;
                }
            }

            // Update streak
            $today = Carbon::today()->toDateString();
            if ($stat->last_review_date?->toDateString() === Carbon::yesterday()->toDateString()) {
                $stat->streak_days++;
            } elseif ($stat->last_review_date?->toDateString() !== $today) {
                $stat->streak_days = 1;
            }

            $stat->xp             += $totalXp;
            $stat->total_time_ms  += $totalDurationMs;
            $stat->last_review_date = $today;
            $stat->save();

            ReviewSession::create([
                'user_id'        => $userId,
                'started_at'     => now()->subMilliseconds($totalDurationMs),
                'completed_at'   => now(),
                'cards_reviewed' => count($items),
                'correct_count'  => $correctCount,
                'session_size'   => count($items),
            ]);
        });

        $level = UserLevel::fromXp($stat->xp);

        return new ReviewResultDto(
            xp_earned: $totalXp,
            accuracy: count($items) > 0 ? round($correctCount / count($items), 2) : 0.0,
            cards_reviewed: count($items),
            duration_ms: $totalDurationMs,
            streak_days: $stat->streak_days,
            level: $level->value,
        );
    }
}
