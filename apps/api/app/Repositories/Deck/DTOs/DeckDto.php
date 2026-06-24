<?php

namespace App\Repositories\Deck\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class DeckDto implements ArrayableDto
{
    public function __construct(
        public int $id,
        public ?int $user_id,
        public string $title,
        public ?string $description,
        public ?int $category_id,
        public ?string $category_name,
        public int $card_count,
        public int $due_today,
        public ?string $cover_emoji,
        public string $created_at,
    ) {}

    public function toArray(): array
    {
        return [
            'id'            => $this->id,
            'user_id'       => $this->user_id,
            'title'         => $this->title,
            'description'   => $this->description,
            'category_id'   => $this->category_id,
            'category_name' => $this->category_name,
            'card_count'    => $this->card_count,
            'due_today'   => $this->due_today,
            'cover_emoji' => $this->cover_emoji,
            'created_at'  => $this->created_at,
        ];
    }
}
