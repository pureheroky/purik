<?php

namespace App\Http\Controllers;

use App\Services\InventoryService;
use App\Services\PetService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(Request $request, PetService $petService): Response|RedirectResponse
    {
        $pet = $request->user()->pet;

        if ($pet === null) {
            return to_route('pet.create');
        }

        $petService->applyDecay($pet);

        return Inertia::render('inventory', [
            'pet' => $pet,
            'inventoryItems' => $request->user()->inventoryItems()->with('item')->orderBy('item_id')->get(),
        ]);
    }

    public function apply(Request $request, InventoryService $inventoryService): RedirectResponse
    {
        $pet = $request->user()->pet()->firstOrFail();

        $request->validate([
            'item_id' => ['required', 'integer'],
        ]);

        $item = $inventoryService->applyItem($request->user(), $pet, $request->integer('item_id'));

        Inertia::flash('toast', ['type' => 'success', 'message' => "You used {$item->name}: +{$item->effect_value} {$item->effect_stat}."]);

        return back();
    }
}
