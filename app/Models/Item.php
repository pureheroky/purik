<?php

namespace App\Models;

use Database\Factories\ItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'description', 'category', 'price', 'effect_stat', 'effect_value', 'image_path'])]
class Item extends Model
{
    /** @use HasFactory<ItemFactory> */
    use HasFactory;
}
