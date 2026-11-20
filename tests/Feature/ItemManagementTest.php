<?php

use App\Models\InventoryItem;
use App\Models\Item;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot manage items', function () {
    $response = $this->get(route('items.index'));

    $response->assertRedirect(route('login'));
});

test('players who are not admins cannot manage items', function () {
    $player = User::factory()->create();
    $item = Item::factory()->create();

    $response = $this->actingAs($player)->delete(route('items.destroy', $item));

    $response->assertForbidden();
    $this->assertModelExists($item);
});

test('admins see all items', function () {
    $admin = User::factory()->admin()->create();
    Item::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('items.index'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('items/index')
        ->has('items', 3)
    );
});

test('admins can open the new item page', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('items.create'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page->component('items/create'));
});

test('admins can add an item to the shop', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('items.store'), [
        'name' => 'Fish',
        'description' => 'Fresh from the river.',
        'category' => 'food',
        'price' => 15,
        'effect_stat' => 'satiety',
        'effect_value' => 25,
        'image_path' => '',
    ]);

    $item = Item::firstWhere('name', 'Fish');
    $response->assertRedirect(route('items.show', $item));
    $this->assertDatabaseHas('items', [
        'name' => 'Fish',
        'category' => 'food',
        'price' => 15,
        'effect_stat' => 'satiety',
        'effect_value' => 25,
        'image_path' => null,
    ]);
});

test('an item with wrong values is not added', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('items.store'), [
        'name' => '',
        'description' => '',
        'category' => 'weapon',
        'price' => 0,
        'effect_stat' => 'speed',
        'effect_value' => 101,
    ]);

    $response->assertSessionHasErrors([
        'name' => 'The name field is required.',
        'description' => 'The description field is required.',
        'category' => 'The selected category is invalid.',
        'price' => 'The price field must be at least 1.',
        'effect_stat' => 'The selected effect stat is invalid.',
        'effect_value' => 'The effect value field must not be greater than 100.',
    ]);
    $this->assertDatabaseCount('items', 0);
});

test('the item page shows how many players own the item', function () {
    $admin = User::factory()->admin()->create();
    $item = Item::factory()->create();
    InventoryItem::factory()->count(2)->for($item)->create();

    $response = $this->actingAs($admin)->get(route('items.show', $item));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('items/show')
        ->where('item.id', $item->id)
        ->where('ownersCount', 2)
    );
});

test('admins can open the edit page of an item', function () {
    $admin = User::factory()->admin()->create();
    $item = Item::factory()->create();

    $response = $this->actingAs($admin)->get(route('items.edit', $item));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('items/edit')
        ->where('item.id', $item->id)
    );
});

test('admins can change an item', function () {
    $admin = User::factory()->admin()->create();
    $item = Item::factory()->create(['name' => 'Apple', 'price' => 10]);

    $response = $this->actingAs($admin)->put(route('items.update', $item), Item::factory()->raw([
        'name' => 'Golden apple',
        'price' => 30,
    ]));

    $response->assertRedirect(route('items.show', $item));
    expect($item->fresh())
        ->name->toBe('Golden apple')
        ->price->toBe(30);
});

test('an item cannot be changed to wrong values', function () {
    $admin = User::factory()->admin()->create();
    $item = Item::factory()->create(['price' => 10]);

    $response = $this->actingAs($admin)->put(route('items.update', $item), Item::factory()->raw([
        'price' => -5,
    ]));

    $response->assertSessionHasErrors(['price' => 'The price field must be at least 1.']);
    expect($item->fresh()->price)->toBe(10);
});

test('deleting an item also removes it from the inventories', function () {
    $admin = User::factory()->admin()->create();
    $item = Item::factory()->create();
    $inventoryItem = InventoryItem::factory()->for($item)->create();

    $response = $this->actingAs($admin)->delete(route('items.destroy', $item));

    $response->assertRedirect(route('items.index'));
    $this->assertModelMissing($item);
    $this->assertModelMissing($inventoryItem);
});
