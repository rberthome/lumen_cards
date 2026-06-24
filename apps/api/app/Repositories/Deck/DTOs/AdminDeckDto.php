<?php

namespace App\Repositories\Deck\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class AdminDeckDto implements ArrayableDto
{
    public function __construct(
        public int     $id,
        public ?int    $category_id,
        public ?string $category_name,
        public string  $title,
        public ?string $description,
        public ?string $cover_emoji,
        public bool    $is_published,
        public int     $card_count,
        public string  $created_at,
    ) {}

    public function toArray(): array
    {
        return [
            'id'            => $this->id,
            'category_id'   => $this->category_id,
            'category_name' => $this->category_name,
            'title'         => $this->title,
            'description'   => $this->description,
            'cover_emoji'   => $this->cover_emoji,
            'is_published'  => $this->is_published,
            'card_count'    => $this->card_count,
            'created_at'    => $this->created_at,
        ];
    }
}
