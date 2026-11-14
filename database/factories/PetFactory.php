<?php

namespace Database\Factories;

use App\Models\Pet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pet>
 */
class PetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->firstName(),
            'level' => 1,
            'experience' => 0,
            'satiety' => 100,
            'happiness' => 100,
            'energy' => 100,
            'cleanliness' => 100,
            'last_decay_at' => now(),
            'last_action_at' => null,
        ];
    }
}
