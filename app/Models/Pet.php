<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\PetFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property int $level
 * @property int $experience
 * @property int $satiety
 * @property int $happiness
 * @property int $energy
 * @property int $cleanliness
 * @property CarbonImmutable $last_decay_at
 * @property CarbonImmutable|null $last_action_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 */
#[Fillable(['name', 'last_decay_at'])]
class Pet extends Model
{
    /** @use HasFactory<PetFactory> */
    use HasFactory;

    public const MAX_STAT = 100;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_decay_at' => 'datetime',
            'last_action_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function requiredExperience(): int
    {
        return $this->level * 50;
    }

    public function changeStat(string $stat, int $amount): void
    {
        $this->{$stat} = max(0, min(self::MAX_STAT, $this->{$stat} + $amount));
    }
}
