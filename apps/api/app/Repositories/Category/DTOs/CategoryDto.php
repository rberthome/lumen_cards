<?php

namespace App\Repositories\Category\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class CategoryDto implements ArrayableDto
{
    public function __construct(
        public int     $id,
        public string  $name,
        public string  $slug,
        public ?string $description,
        public ?string $cover_emoji,
        public int     $sort_order,
        public int     $deck_count,
    ) {}

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'slug'        => $this->slug,
            'description' => $this->description,
            'cover_emoji' => $this->cover_emoji,
            'sort_order'  => $this->sort_order,
            'deck_count'  => $this->deck_count,
        ];
    }
}
