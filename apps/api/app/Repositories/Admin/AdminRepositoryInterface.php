<?php

namespace App\Repositories\Admin;

use App\Repositories\Admin\DTOs\AdminStatsDto;
use App\Repositories\Admin\DTOs\AdminUserDto;
use Illuminate\Pagination\LengthAwarePaginator;

interface AdminRepositoryInterface
{
    public function paginateUsers(int $page, ?string $search): LengthAwarePaginator;

    public function getStats(): AdminStatsDto;

    public function exportUser(int $userId): array;

    public function anonymizeUser(int $userId): void;
}
