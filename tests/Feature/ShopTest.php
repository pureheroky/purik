<?php

use App\Models\InventoryItem;
use App\Models\Item;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the shop shows all items', function () {
    $user = User::factory()->create();
    Item::factory()->count(3)->create();

    $response = $this->actingAs($user)->get(route('shop'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('shop')
        ->has('items', 3)
    );
});

test('guests cannot buy items', function () {
    $item = Item::factory()->create();

    $response = $this->post(route('shop.purchase'), ['item_id' => $item->id, 'quantity' => 1]);

    $response->assertRedirect(route('login'));
});

test('buying an item takes coins and adds it to the inventory', function () {
    $user = User::factory()->create(['coins' => 100]);
    $item = Item::factory()->create(['price' => 10]);

    $response = $this->actingAs($user)->post(route('shop.purchase'), ['item_id' => $item->id, 'quantity' => 2]);

    $response->assertRedirect(route('shop'));
    expect($user->fresh()->coins)->toBe(80);
    $this->assertDatabaseHas('inventory_items', [
        'user_id' => $user->id,
        'item_id' => $item->id,
        'quantity' => 2,
    ]);
});

test('buying an item the user already has increases its quantity', function () {
    $user = User::factory()->create();
    $inventoryItem = InventoryItem::factory()->for($user)->create(['quantity' => 3]);

    $this->actingAs($user)->post(route('shop.purchase'), ['item_id' => $inventoryItem->item_id, 'quantity' => 1]);

    expect($inventoryItem->fresh()->quantity)->toBe(4);
    $this->assertDatabaseCount('inventory_items', 1);
});

test('an item cannot be bought without enough coins', function () {
    $user = User::factory()->create(['coins' => 15]);
    $item = Item::factory()->create(['price' => 10]);

    $response = $this->actingAs($user)->post(route('shop.purchase'), ['item_id' => $item->id, 'quantity' => 2]);

    $response->assertSessionHasErrors(['coins' => 'Not enough coins. You need 20, but you have 15.']);
    expect($user->fresh()->coins)->toBe(15);
    $this->assertDatabaseCount('inventory_items', 0);
});

test('the quantity must be at least 1', function (int $quantity) {
    $user = User::factory()->create(['coins' => 100]);
    $item = Item::factory()->create();

    $response = $this->actingAs($user)->post(route('shop.purchase'), ['item_id' => $item->id, 'quantity' => $quantity]);

    $response->assertSessionHasErrors(['quantity' => 'The quantity field must be at least 1.']);
    expect($user->fresh()->coins)->toBe(100);
})->with([
    'zero' => 0,
    'negative' => -5,
]);

test('an item that does not exist cannot be bought', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('shop.purchase'), ['item_id' => 999, 'quantity' => 1]);

    $response->assertSessionHasErrors(['item_id' => 'The selected item id is invalid.']);
});
