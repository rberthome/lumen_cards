<?php

namespace Database\Factories;

use App\Enums\DeckCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeckFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'     => null,
            'title'       => fake()->sentence(3),
            'description' => fake()->sentence(),
            'category'    => fake()->randomElement(DeckCategory::cases())->value,
            'cover_emoji' => '📚',
        ];
    }
}
