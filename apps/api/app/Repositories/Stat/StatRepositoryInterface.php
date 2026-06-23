<?php

namespace App\Repositories\Stat;

use App\Repositories\Stat\DTOs\UserStatDto;

interface StatRepositoryInterface
{
    public function findForUser(int $userId): UserStatDto;
}
