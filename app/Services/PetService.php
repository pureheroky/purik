<?php

namespace App\Services;

use App\Models\Pet;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PetService
{
    public const ACTIONS = [
        'feed' => ['satiety' => 20],
        'play' => ['happiness' => 20, 'energy' => -15],
        'sleep' => ['energy' => 30, 'satiety' => -10],
        'clean' => ['cleanliness' => 30],
    ];

    public const DECAY_PER_TICK = [
        'satiety' => 2,
        'happiness' => 1,
        'energy' => 1,
        'cleanliness' => 1,
    ];

    public const DECAY_TICK_MINUTES = 10;

    public const ACTION_COOLDOWN_SECONDS = 60;

    public const ACTION_EXPERIENCE = 10;

    public const ACTION_COINS = 5;

    public const LEVEL_UP_COINS = 50;

    public function applyDecay(Pet $pet): void
    {
        $minutesPassed = $pet->last_decay_at->diffInMinutes(now());
        $ticks = (int) floor($minutesPassed / self::DECAY_TICK_MINUTES);

        if ($ticks < 1) {
            return;
        }

        foreach (self::DECAY_PER_TICK as $stat => $amount) {
            $pet->changeStat($stat, -$amount * $ticks);
        }

        $pet->last_decay_at = $pet->last_decay_at->addMinutes($ticks * self::DECAY_TICK_MINUTES);
        $pet->save();
    }

    public function performAction(Pet $pet, string $action): bool
    {
        $this->applyDecay($pet);

        $secondsLeft = $this->cooldownSecondsLeft($pet);

        if ($secondsLeft > 0) {
            throw ValidationException::withMessages([
                'action' => "{$pet->name} is resting. Try again in {$secondsLeft} seconds.",
            ]);
        }

        $changes = self::ACTIONS[$action];
        $mainStat = array_key_first($changes);

        if ($pet->{$mainStat} >= Pet::MAX_STAT) {
            throw ValidationException::withMessages([
                'action' => "{$pet->name} doesn't need this right now.",
            ]);
        }

        return DB::transaction(function () use ($pet, $changes) {
            foreach ($changes as $stat => $amount) {
                $pet->changeStat($stat, $amount);
            }

            $pet->last_action_at = now();
            $pet->user->coins += self::ACTION_COINS;
            $leveledUp = $this->addExperience($pet, self::ACTION_EXPERIENCE);

            $pet->save();
            $pet->user->save();

            return $leveledUp;
        });
    }

    public function cooldownSecondsLeft(Pet $pet): int
    {
        if ($pet->last_action_at === null) {
            return 0;
        }

        $secondsPassed = $pet->last_action_at->diffInSeconds(now());

        return max(0, (int) ceil(self::ACTION_COOLDOWN_SECONDS - $secondsPassed));
    }

    private function addExperience(Pet $pet, int $amount): bool
    {
        $pet->experience += $amount;
        $requiredExperience = $pet->requiredExperience();

        if ($pet->experience < $requiredExperience) {
            return false;
        }

        $pet->experience -= $requiredExperience;
        $pet->level++;
        $pet->user->coins += self::LEVEL_UP_COINS;

        return true;
    }
}
