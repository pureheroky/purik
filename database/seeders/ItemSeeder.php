<?php

namespace Database\Seeders;

use App\Models\Item;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Apple', 'description' => 'A crunchy snack.', 'category' => 'food', 'price' => 10, 'effect_stat' => 'satiety', 'effect_value' => 15, 'image_path' => '/images/items/apple.png'],
            ['name' => 'Steak', 'description' => 'A big, filling meal.', 'category' => 'food', 'price' => 25, 'effect_stat' => 'satiety', 'effect_value' => 40, 'image_path' => '/images/items/steak.png'],
            ['name' => 'Ball', 'description' => 'Bouncy and fun.', 'category' => 'toy', 'price' => 10, 'effect_stat' => 'happiness', 'effect_value' => 15, 'image_path' => '/images/items/ball.png'],
            ['name' => 'Teddy Bear', 'description' => 'The best friend to hug.', 'category' => 'toy', 'price' => 25, 'effect_stat' => 'happiness', 'effect_value' => 40, 'image_path' => '/images/items/teddy-bear.png'],
            ['name' => 'Soap', 'description' => 'A quick wash.', 'category' => 'hygiene', 'price' => 10, 'effect_stat' => 'cleanliness', 'effect_value' => 15, 'image_path' => '/images/items/soap.png'],
            ['name' => 'Zhumaisinba', 'description' => 'A full bubble bath.', 'category' => 'hygiene', 'price' => 25, 'effect_stat' => 'cleanliness', 'effect_value' => 40, 'image_path' => '/images/items/shampoo.png'],
            ['name' => 'Paracetamol', 'description' => 'A small energy boost.', 'category' => 'energy', 'price' => 10, 'effect_stat' => 'energy', 'effect_value' => 15, 'image_path' => '/images/items/vitamins.png'],
            ['name' => 'Red bull', 'description' => 'Full power in one can.', 'category' => 'energy', 'price' => 25, 'effect_stat' => 'energy', 'effect_value' => 40, 'image_path' => '/images/items/energy-drink.png'],
        ];

        Item::factory()->createMany($items);
    }
}
