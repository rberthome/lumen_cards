<?php

namespace App\Repositories\Review\DTOs;

use App\DTOs\ArrayableDto;
use App\Repositories\Card\DTOs\CardWithProgressDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class ReviewSessionDto implements ArrayableDto
{
    /**
     * @param CardWithProgressDto[] $cards
     */
    public function __construct(
        public int $id,
        public array $cards,
        public int $session_size,
        public ?int $deck_id,
    ) {}

    public function toArray(): array
    {
        return [
            'id'           => $this->id,
            'cards'        => array_map(fn (CardWithProgressDto $c) => $c->toArray(), $this->cards),
            'session_size' => $this->session_size,
            'deck_id'      => $this->deck_id,
        ];
    }
}
