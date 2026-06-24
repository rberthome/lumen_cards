<?php

namespace App\Repositories\Role\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class RoleDto implements ArrayableDto
{
    public function __construct(
        public int    $id,
        public string $name,
        public string $slug,
        public ?string $description,
        public bool   $is_system,
        /** @var string[] */
        public array  $permissions,
    ) {}

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'description' => $this->description,
            'is_system'   => $this->is_system,
            'permissions' => $this->permissions,
        ];
    }
}
