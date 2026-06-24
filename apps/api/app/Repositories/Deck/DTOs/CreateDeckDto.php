<?php

namespace App\Repositories\Deck\DTOs;

readonly class CreateDeckDto
{
    public function __construct(
        public string $title,
        public ?int $category_id = null,
        public ?string $description = null,
        public ?string $cover_emoji = null,
    ) {}
}
