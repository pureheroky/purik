<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('game', [PetController::class, 'show'])->name('game');

    Route::get('pet/create', [PetController::class, 'create'])->name('pet.create');
    Route::post('pet', [PetController::class, 'store'])->name('pet.store');
    Route::patch('pet', [PetController::class, 'update'])->name('pet.update');
    Route::post('pet/action', [PetController::class, 'action'])->name('pet.action');

    Route::get('shop', [ShopController::class, 'index'])->name('shop');
    Route::post('shop/purchase', [ShopController::class, 'purchase'])->name('shop.purchase');

    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory');
    Route::post('inventory/apply', [InventoryController::class, 'apply'])->name('inventory.apply');

    Route::resource('items', ItemController::class)->middleware('can:manage-items');
});

require __DIR__.'/settings.php';
