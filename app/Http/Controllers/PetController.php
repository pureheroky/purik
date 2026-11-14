<?php

namespace App\Http\Controllers;

use App\Services\PetService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PetController extends Controller
{
    public function show(Request $request, PetService $petService): Response|RedirectResponse
    {
        $pet = $request->user()->pet;

        if ($pet === null) {
            return to_route('pet.create');
        }

        $petService->applyDecay($pet);

        return Inertia::render('game', [
            'pet' => $pet,
            'requiredExperience' => $pet->requiredExperience(),
            'inventoryItems' => $request->user()->inventoryItems()->with('item')->orderBy('item_id')->get(),
        ]);
    }

    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()->pet !== null) {
            return to_route('game');
        }

        return Inertia::render('pet/create');
    }

    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->pet !== null) {
            return to_route('game');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
        ]);

        $request->user()->pet()->create([
            'name' => $validated['name'],
            'last_decay_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Say hi to {$validated['name']}!"]);

        return to_route('game');
    }

    public function update(Request $request): RedirectResponse
    {
        $pet = $request->user()->pet()->firstOrFail();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
        ]);

        $pet->update(['name' => $validated['name']]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Name saved.']);

        return to_route('game');
    }

    public function action(Request $request, PetService $petService): RedirectResponse
    {
        $pet = $request->user()->pet()->firstOrFail();

        $validated = $request->validate([
            'action' => ['required', Rule::in(array_keys(PetService::ACTIONS))],
        ]);

        $leveledUp = $petService->performAction($pet, $validated['action']);

        $message = '+'.PetService::ACTION_EXPERIENCE.' XP, +'.PetService::ACTION_COINS.' coins';

        if ($leveledUp) {
            $message = "Level up! {$pet->name} is now level {$pet->level}. +".PetService::LEVEL_UP_COINS.' coins';
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return to_route('game');
    }
}
