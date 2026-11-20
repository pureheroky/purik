<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;

test('the seeder creates an admin who can log in and play right away', function () {
    $this->seed(DatabaseSeeder::class);

    $admin = User::firstWhere('email', 'admin@admin.com');
    expect($admin->is_admin)->toBeTrue()
        ->and($admin->pet)->not->toBeNull()
        ->and($admin->inventoryItems()->count())->toBe(4);

    $response = $this->post(route('login.store'), [
        'email' => 'admin@admin.com',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('game', absolute: false));
});

test('the seeder fills the shop and adds players with pets', function () {
    $this->seed(DatabaseSeeder::class);

    $this->assertDatabaseCount('items', 8);
    $this->assertDatabaseCount('users', 6);
    $this->assertDatabaseCount('pets', 6);
});
