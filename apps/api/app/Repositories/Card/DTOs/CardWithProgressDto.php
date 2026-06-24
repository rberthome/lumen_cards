<?php

namespace App\Repositories\Card\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class CardWithProgressDto implements ArrayableDto
{
    public function __construct(
        public int $id,
        public int $deck_id,
        public string $front,
        public string $back,
        public ?string $wrong_answer_1,
        public ?string $wrong_answer_2,
        public ?string $wrong_answer_3,
        public ?string $explanation,
        public ?string $source,
        public array $tags,
        public string $difficulty,
        public int $interval,
        public int $repetition,
        public float $ease_factor,
        public ?string $next_review_at,
        public bool $show_choices,
    ) {}

    public function toArray(): array
    {
        return [
            'id'             => $this->id,
            'deck_id'        => $this->deck_id,
            'front'          => $this->front,
            'back'           => $this->back,
            'wrong_answer_1' => $this->wrong_answer_1,
            'wrong_answer_2' => $this->wrong_answer_2,
            'wrong_answer_3' => $this->wrong_answer_3,
            'explanation'    => $this->explanation,
            'source'         => $this->source,
            'tags'           => $this->tags,
            'difficulty'     => $this->difficulty,
            'interval'       => $this->interval,
            'repetition'     => $this->repetition,
            'ease_factor'    => $this->ease_factor,
            'next_review_at' => $this->next_review_at,
            'show_choices'   => $this->show_choices,
        ];
    }
}
