<?php

namespace App\Repositories\Deck\DTOs;

readonly class CreateDeckDto
{
    public function __construct(
        public string $title,
        public string $category,
        public ?string $description = null,
        public ?string $cover_emoji = null,
    ) {}
}
