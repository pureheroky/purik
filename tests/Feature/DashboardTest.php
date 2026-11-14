<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('game'));
    $response->assertRedirect(route('login'));
});

test('users without a pet are sent to create one first', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('game'));
    $response->assertRedirect(route('pet.create'));
});
