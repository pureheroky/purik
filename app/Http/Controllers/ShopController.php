<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Services\ShopService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('shop', [
            'items' => Item::orderBy('id')->get(),
        ]);
    }

    public function purchase(Request $request, ShopService $shopService): RedirectResponse
    {
        $request->validate([
            'item_id' => ['required', 'integer', 'exists:items,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $item = Item::findOrFail($request->integer('item_id'));
        $quantity = $request->integer('quantity');

        $shopService->purchase($request->user(), $item, $quantity);

        Inertia::flash('toast', ['type' => 'success', 'message' => "You bought {$item->name} x{$quantity}."]);

        return to_route('shop');
    }
}
