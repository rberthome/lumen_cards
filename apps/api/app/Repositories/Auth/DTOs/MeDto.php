<?php

namespace App\Repositories\Auth\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class MeDto implements ArrayableDto
{
    public function __construct(
        public int     $id,
        public string  $name,
        public string  $email,
        public ?string $role_slug,
        public ?string $role_name,
        /** @var string[] */
        public array   $permissions,
    ) {}

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'email'       => $this->email,
            'role_slug'   => $this->role_slug,
            'role_name'   => $this->role_name,
            'permissions' => $this->permissions,
        ];
    }
}
