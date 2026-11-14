<?php

namespace App\Services;

use App\Models\Item;
use App\Models\Pet;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryService
{
    public function __construct(private PetService $petService) {}

    public function applyItem(User $user, Pet $pet, int $itemId): Item
    {
        $inventoryItem = $user->inventoryItems()->with('item')->where('item_id', $itemId)->first();

        if ($inventoryItem === null) {
            throw ValidationException::withMessages([
                'item_id' => "You don't have this item.",
            ]);
        }

        $item = $inventoryItem->item;
        $this->petService->applyDecay($pet);

        if ($pet->{$item->effect_stat} >= Pet::MAX_STAT) {
            throw ValidationException::withMessages([
                'item_id' => "{$pet->name} doesn't need {$item->name} right now.",
            ]);
        }

        DB::transaction(function () use ($pet, $item, $inventoryItem) {
            $pet->changeStat($item->effect_stat, $item->effect_value);
            $pet->save();

            if ($inventoryItem->quantity > 1) {
                $inventoryItem->decrement('quantity');
            } else {
                $inventoryItem->delete();
            }
        });

        return $item;
    }
}
