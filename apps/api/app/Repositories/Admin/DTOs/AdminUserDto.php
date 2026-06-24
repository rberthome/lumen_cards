<?php

namespace App\Repositories\Admin\DTOs;

readonly class AdminUserDto
{
    public function __construct(
        public int    $id,
        public string $name,
        public string $email,
        public string $role,
        public string $level,
        public int    $xp,
        public int    $streak_days,
        public string $created_at,
    ) {}

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'email'       => $this->email,
            'role'        => $this->role,
            'level'       => $this->level,
            'xp'          => $this->xp,
            'streak_days' => $this->streak_days,
            'created_at'  => $this->created_at,
        ];
    }
}
