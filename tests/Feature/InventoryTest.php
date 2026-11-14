<?php

use App\Models\InventoryItem;
use App\Models\Item;
use App\Models\Pet;
use Inertia\Testing\AssertableInertia as Assert;

test('the inventory shows only the user\'s own items', function () {
    $pet = Pet::factory()->create();
    InventoryItem::factory()->for($pet->user)->create();
    InventoryItem::factory()->create();

    $response = $this->actingAs($pet->user)->get(route('inventory'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('inventory')
        ->has('inventoryItems', 1)
    );
});

test('guests cannot use items', function () {
    $response = $this->post(route('inventory.apply'), ['item_id' => 1]);

    $response->assertRedirect(route('login'));
});

test('using an item raises the pet stat and lowers the quantity', function () {
    $pet = Pet::factory()->create(['satiety' => 50]);
    $item = Item::factory()->create(['effect_stat' => 'satiety', 'effect_value' => 15]);
    $inventoryItem = InventoryItem::factory()->for($pet->user)->for($item)->create(['quantity' => 2]);

    $response = $this->actingAs($pet->user)
        ->from(route('inventory'))
        ->post(route('inventory.apply'), ['item_id' => $item->id]);

    $response->assertRedirect(route('inventory'));
    expect($pet->fresh()->satiety)->toBe(65);
    expect($inventoryItem->fresh()->quantity)->toBe(1);
});

test('an item used on the game page sends the player back to the game page', function () {
    $pet = Pet::factory()->create(['satiety' => 50]);
    $inventoryItem = InventoryItem::factory()->for($pet->user)->create();

    $response = $this->actingAs($pet->user)
        ->from(route('game'))
        ->post(route('inventory.apply'), ['item_id' => $inventoryItem->item_id]);

    $response->assertRedirect(route('game'));
});

test('using the last item removes it from the inventory', function () {
    $pet = Pet::factory()->create(['satiety' => 50]);
    $inventoryItem = InventoryItem::factory()->for($pet->user)->create(['quantity' => 1]);

    $this->actingAs($pet->user)->post(route('inventory.apply'), ['item_id' => $inventoryItem->item_id]);

    $this->assertModelMissing($inventoryItem);
});

test('a user cannot use an item they do not have', function () {
    $pet = Pet::factory()->create(['satiety' => 50]);
    $otherUsersItem = InventoryItem::factory()->create(['quantity' => 1]);

    $response = $this->actingAs($pet->user)->post(route('inventory.apply'), ['item_id' => $otherUsersItem->item_id]);

    $response->assertSessionHasErrors(['item_id' => "You don't have this item."]);
    expect($pet->fresh()->satiety)->toBe(50);
    expect($otherUsersItem->fresh()->quantity)->toBe(1);
});

test('an item the pet does not need is not used up', function () {
    $pet = Pet::factory()->create(['satiety' => 100]);
    $item = Item::factory()->create(['name' => 'Apple', 'effect_stat' => 'satiety']);
    $inventoryItem = InventoryItem::factory()->for($pet->user)->for($item)->create(['quantity' => 1]);

    $response = $this->actingAs($pet->user)->post(route('inventory.apply'), ['item_id' => $item->id]);

    $response->assertSessionHasErrors(['item_id' => "{$pet->name} doesn't need Apple right now."]);
    $this->assertModelExists($inventoryItem);
});
