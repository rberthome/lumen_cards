<?php

namespace App\Repositories\Role\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class PermissionDto implements ArrayableDto
{
    public function __construct(
        public int    $id,
        public string $entity,
        public string $action,
        public ?string $description,
    ) {}

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'entity'      => $this->entity,
            'action'      => $this->action,
            'description' => $this->description,
        ];
    }
}
