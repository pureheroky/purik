<?php

namespace App\Services;

use App\Models\Item;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ShopService
{
    public function purchase(User $user, Item $item, int $quantity): void
    {
        $totalPrice = $item->price * $quantity;

        if ($user->coins < $totalPrice) {
            throw ValidationException::withMessages([
                'coins' => "Not enough coins. You need {$totalPrice}, but you have {$user->coins}.",
            ]);
        }

        DB::transaction(function () use ($user, $item, $quantity, $totalPrice) {
            $user->decrement('coins', $totalPrice);

            $inventoryItem = $user->inventoryItems()->firstOrCreate(
                ['item_id' => $item->id],
                ['quantity' => 0],
            );

            $inventoryItem->increment('quantity', $quantity);
        });
    }
}
