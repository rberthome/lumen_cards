<?php

namespace App\Repositories\Card\DTOs;

use App\DTOs\ArrayableDto;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
readonly class AdminCardDto implements ArrayableDto
{
    public function __construct(
        public int     $id,
        public int     $deck_id,
        public string  $deck_title,
        public string  $front,
        public string  $back,
        public ?string $wrong_answer_1,
        public ?string $wrong_answer_2,
        public ?string $wrong_answer_3,
        public ?string $explanation,
        public ?string $source,
        public array   $tags,
        public string  $difficulty,
        public array   $progression_config,
        public string  $created_at,
    ) {}

    public function toArray(): array
    {
        return [
            'id'               => $this->id,
            'deck_id'          => $this->deck_id,
            'deck_title'       => $this->deck_title,
            'front'            => $this->front,
            'back'             => $this->back,
            'wrong_answer_1'   => $this->wrong_answer_1,
            'wrong_answer_2'   => $this->wrong_answer_2,
            'wrong_answer_3'   => $this->wrong_answer_3,
            'explanation'      => $this->explanation,
            'source'           => $this->source,
            'tags'             => $this->tags,
            'difficulty'       => $this->difficulty,
            'progression_config' => $this->progression_config,
            'created_at'       => $this->created_at,
        ];
    }
}
