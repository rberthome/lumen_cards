<?php

namespace App\Repositories\Card\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class CardDto implements ArrayableDto
{
    public function __construct(
        public int $id,
        public int $deck_id,
        public string $front,
        public string $back,
        public ?string $explanation,
        public ?string $source,
        public array $tags,
        public string $difficulty,
    ) {}

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'deck_id'     => $this->deck_id,
            'front'       => $this->front,
            'back'        => $this->back,
            'explanation' => $this->explanation,
            'source'      => $this->source,
            'tags'        => $this->tags,
            'difficulty'  => $this->difficulty,
        ];
    }
}
