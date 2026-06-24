<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DeckFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'      => null,
            'category_id'  => null,
            'title'        => fake()->sentence(3),
            'description'  => fake()->sentence(),
            'cover_emoji'  => '📚',
            'is_published' => true,
        ];
    }
}
