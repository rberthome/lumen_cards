<?php

namespace App\Repositories\Admin;

use App\Enums\UserLevel;
use App\Models\CardProgress;
use App\Models\ReviewSession;
use App\Models\User;
use App\Models\UserStat;
use App\Repositories\Admin\DTOs\AdminStatsDto;
use App\Repositories\Admin\DTOs\AdminUserDto;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

readonly class AdminRepository implements AdminRepositoryInterface
{
    public function paginateUsers(int $page, ?string $search): LengthAwarePaginator
    {
        return User::query()
            ->when($search, fn ($q) => $q->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            }))
            ->with('stat')
            ->orderBy('created_at', 'desc')
            ->paginate(perPage: 25, page: $page);
    }

    public function getStats(): AdminStatsDto
    {
        $totalUsers = User::count();

        $activeToday = UserStat::whereDate('last_review_date', today())->count();

        $totalCardsReviewed = ReviewSession::whereNotNull('completed_at')
            ->sum('cards_reviewed');

        $avgAccuracy = ReviewSession::whereNotNull('completed_at')
            ->where('cards_reviewed', '>', 0)
            ->selectRaw('AVG(correct_count::float / cards_reviewed) as avg')
            ->value('avg') ?? 0.0;

        return new AdminStatsDto(
            total_users: $totalUsers,
            active_today: $activeToday,
            total_cards_reviewed: (int) $totalCardsReviewed,
            average_accuracy: round((float) $avgAccuracy, 2),
        );
    }

    public function exportUser(int $userId): array
    {
        $user = User::with(['stat', 'cardProgresses.card', 'reviewSessions'])->findOrFail($userId);

        return [
            'exported_at' => now()->toISOString(),
            'user'        => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'created_at' => $user->created_at,
            ],
            'stats'           => $user->stat?->toArray(),
            'card_progresses' => $user->cardProgresses->map(fn ($p) => [
                'card'             => $p->card?->only(['front', 'back']),
                'repetition'       => $p->repetition,
                'ease_factor'      => $p->ease_factor,
                'next_review_at'   => $p->next_review_at,
                'last_reviewed_at' => $p->last_reviewed_at,
            ]),
            'review_sessions' => $user->reviewSessions->map(fn ($s) => $s->only([
                'started_at', 'completed_at', 'cards_reviewed', 'correct_count',
            ])),
        ];
    }

    public function anonymizeUser(int $userId): void
    {
        DB::transaction(function () use ($userId) {
            $user = User::findOrFail($userId);
            $user->update([
                'name'     => 'Utilisateur supprimé',
                'email'    => "deleted_{$userId}@lumencards.invalid",
                'password' => bcrypt(str()->random(32)),
            ]);
            $user->tokens()->delete();
            $user->cardProgresses()->delete();
            $user->reviewSessions()->delete();
            $user->stat()->delete();
        });
    }
}
