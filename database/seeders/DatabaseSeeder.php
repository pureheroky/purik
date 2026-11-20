<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\Item;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(ItemSeeder::class);

        $admin = User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
        ]);

        Pet::factory()->for($admin)->create([
            'name' => 'Purik',
            'level' => 2,
            'experience' => 30,
            'satiety' => 60,
            'happiness' => 85,
            'energy' => 45,
            'cleanliness' => 75,
        ]);

        foreach (Item::take(4)->get() as $item) {
            InventoryItem::factory()->for($admin)->for($item)->create(['quantity' => 2]);
        }

        $players = User::factory(5)->create();

        foreach ($players as $player) {
            Pet::factory()->for($player)->create();

            InventoryItem::factory()->for($player)->for(Item::inRandomOrder()->first())->create([
                'quantity' => fake()->numberBetween(1, 3),
            ]);
        }
    }
}
