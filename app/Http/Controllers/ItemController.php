<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Pet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('items/index', [
            'items' => Item::orderBy('id')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('items/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:500'],
            'category' => ['required', Rule::in(Item::CATEGORIES)],
            'price' => ['required', 'integer', 'min:1', 'max:1000'],
            'effect_stat' => ['required', Rule::in(Pet::STATS)],
            'effect_value' => ['required', 'integer', 'min:1', 'max:100'],
            'image_path' => ['nullable', 'string', 'max:255'],
        ]);

        $item = Item::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => "{$item->name} was added to the shop."]);

        return to_route('items.show', $item);
    }

    public function show(Item $item): Response
    {
        return Inertia::render('items/show', [
            'item' => $item,
            'ownersCount' => $item->inventoryItems()->count(),
        ]);
    }

    public function edit(Item $item): Response
    {
        return Inertia::render('items/edit', [
            'item' => $item,
        ]);
    }

    public function update(Request $request, Item $item): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:500'],
            'category' => ['required', Rule::in(Item::CATEGORIES)],
            'price' => ['required', 'integer', 'min:1', 'max:1000'],
            'effect_stat' => ['required', Rule::in(Pet::STATS)],
            'effect_value' => ['required', 'integer', 'min:1', 'max:100'],
            'image_path' => ['nullable', 'string', 'max:255'],
        ]);

        $item->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => "{$item->name} was saved."]);

        return to_route('items.show', $item);
    }

    public function destroy(Item $item): RedirectResponse
    {
        $item->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => "{$item->name} was removed from the shop."]);

        return to_route('items.index');
    }
}
