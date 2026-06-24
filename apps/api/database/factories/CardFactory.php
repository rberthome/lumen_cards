<?php

namespace Database\Factories;

use App\Enums\CardDifficulty;
use App\Models\Deck;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardFactory extends Factory
{
    public function definition(): array
    {
        return [
            'deck_id'    => Deck::factory(),
            'front'      => fake()->sentence() . '?',
            'back'       => fake()->paragraph(),
            'explanation' => fake()->paragraph(),
            'source'     => fake()->words(3, true),
            'tags'       => ['test'],
            'difficulty' => fake()->randomElement(CardDifficulty::cases())->value,
        ];
    }
}
