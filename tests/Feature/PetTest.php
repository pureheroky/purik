<?php

use App\Models\InventoryItem;
use App\Models\Pet;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

describe('creating a pet', function () {
    test('a user can create a pet', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('pet.store'), ['name' => 'Purik']);

        $response->assertRedirect(route('game'));
        $this->assertDatabaseHas('pets', [
            'user_id' => $user->id,
            'name' => 'Purik',
            'level' => 1,
            'satiety' => 100,
        ]);
    });

    test('a pet needs a name', function () {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('pet.store'), ['name' => '']);

        $response->assertSessionHasErrors(['name' => 'The name field is required.']);
        $this->assertDatabaseCount('pets', 0);
    });

    test('a user cannot create a second pet', function () {
        $pet = Pet::factory()->create();

        $response = $this->actingAs($pet->user)->post(route('pet.store'), ['name' => 'Second']);

        $response->assertRedirect(route('game'));
        $this->assertDatabaseCount('pets', 1);
    });

    test('users who already have a pet are sent from pet creation to the game', function () {
        $pet = Pet::factory()->create();

        $response = $this->actingAs($pet->user)->get(route('pet.create'));

        $response->assertRedirect(route('game'));
    });
});

describe('game page', function () {
    test('the game page shows the pet', function () {
        $pet = Pet::factory()->create(['name' => 'Purik', 'level' => 2]);

        $response = $this->actingAs($pet->user)->get(route('game'));

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('game')
            ->where('pet.name', 'Purik')
            ->where('requiredExperience', 100)
        );
    });

    test('the game page shows only the user\'s own items', function () {
        $pet = Pet::factory()->create();
        InventoryItem::factory()->for($pet->user)->create();
        InventoryItem::factory()->create();

        $response = $this->actingAs($pet->user)->get(route('game'));

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('game')
            ->has('inventoryItems', 1)
        );
    });

    test('stats go down for every full 10 minutes that passed', function () {
        $this->travelTo('2026-01-01 12:25:00');
        $pet = Pet::factory()->create(['last_decay_at' => '2026-01-01 12:00:00']);

        $this->actingAs($pet->user)->get(route('game'));

        $pet->refresh();
        expect($pet->satiety)->toBe(96)
            ->and($pet->happiness)->toBe(98)
            ->and($pet->energy)->toBe(98)
            ->and($pet->cleanliness)->toBe(98)
            ->and($pet->last_decay_at->toDateTimeString())->toBe('2026-01-01 12:20:00');
    });

    test('stats do not go below 0', function () {
        $this->travelTo('2026-01-01 14:00:00');
        $pet = Pet::factory()->create(['satiety' => 3, 'last_decay_at' => '2026-01-01 12:00:00']);

        $this->actingAs($pet->user)->get(route('game'));

        expect($pet->fresh()->satiety)->toBe(0);
    });
});

describe('renaming a pet', function () {
    test('a pet can be renamed', function () {
        $pet = Pet::factory()->create(['name' => 'Old name']);

        $response = $this->actingAs($pet->user)->patch(route('pet.update'), ['name' => 'New name']);

        $response->assertRedirect(route('game'));
        expect($pet->fresh()->name)->toBe('New name');
    });
});

describe('pet actions', function () {
    test('guests cannot take care of a pet', function () {
        $response = $this->post(route('pet.action'), ['action' => 'feed']);

        $response->assertRedirect(route('login'));
    });

    test('feeding the pet raises satiety and gives XP and coins', function () {
        $pet = Pet::factory()->create(['satiety' => 50]);

        $response = $this->actingAs($pet->user)->post(route('pet.action'), ['action' => 'feed']);

        $response->assertRedirect(route('game'));
        $pet->refresh();
        expect($pet->satiety)->toBe(70)
            ->and($pet->experience)->toBe(10)
            ->and($pet->last_action_at)->not->toBeNull();
        expect($pet->user->coins)->toBe(105);
    });

    test('stats stay between 0 and 100 after an action', function () {
        $pet = Pet::factory()->create(['happiness' => 90, 'energy' => 10]);

        $this->actingAs($pet->user)->post(route('pet.action'), ['action' => 'play']);

        $pet->refresh();
        expect($pet->happiness)->toBe(100)
            ->and($pet->energy)->toBe(0);
    });

    test('an unknown action is rejected', function () {
        $pet = Pet::factory()->create();

        $response = $this->actingAs($pet->user)->post(route('pet.action'), ['action' => 'dance']);

        $response->assertSessionHasErrors(['action' => 'The selected action is invalid.']);
    });

    test('the pet cannot do another action during the 60 second cooldown', function () {
        $this->travelTo('2026-01-01 12:00:45');
        $pet = Pet::factory()->create(['satiety' => 50, 'last_action_at' => '2026-01-01 12:00:00']);

        $response = $this->actingAs($pet->user)->post(route('pet.action'), ['action' => 'feed']);

        $response->assertSessionHasErrors(['action' => "{$pet->name} is resting. Try again in 15 seconds."]);
        $pet->refresh();
        expect($pet->satiety)->toBe(50)
            ->and($pet->experience)->toBe(0);
        expect($pet->user->coins)->toBe(100);
    });

    test('the pet can do an action again once the cooldown is over', function () {
        $this->travelTo('2026-01-01 12:01:00');
        $pet = Pet::factory()->create(['satiety' => 50, 'last_action_at' => '2026-01-01 12:00:00']);

        $response = $this->actingAs($pet->user)->post(route('pet.action'), ['action' => 'feed']);

        $response->assertSessionHasNoErrors();
        expect($pet->fresh()->satiety)->toBe(70);
    });

    test('an action the pet does not need gives no reward', function () {
        $pet = Pet::factory()->create(['satiety' => 100]);

        $response = $this->actingAs($pet->user)->post(route('pet.action'), ['action' => 'feed']);

        $response->assertSessionHasErrors(['action' => "{$pet->name} doesn't need this right now."]);
        $pet->refresh();
        expect($pet->experience)->toBe(0)
            ->and($pet->last_action_at)->toBeNull();
        expect($pet->user->coins)->toBe(100);
    });

    test('the pet levels up, keeps the extra XP and gives bonus coins', function () {
        $pet = Pet::factory()->create(['level' => 2, 'experience' => 95, 'satiety' => 50]);

        $this->actingAs($pet->user)->post(route('pet.action'), ['action' => 'feed']);

        $pet->refresh();
        expect($pet->level)->toBe(3)
            ->and($pet->experience)->toBe(5);
        expect($pet->user->coins)->toBe(155);
    });
});
