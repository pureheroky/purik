import ProgressBar from '@/components/game/progress-bar';
import { STAT_KEYS, STATS } from '@/lib/game';
import { cn } from '@/lib/utils';
import type { Pet } from '@/types';

export default function PetStats({
    pet,
    className,
}: {
    pet: Pet;
    className?: string;
}) {
    return (
        <div className={cn('grid gap-4', className)}>
            {STAT_KEYS.map((stat) => (
                <div
                    key={stat}
                    className="grid grid-cols-[2rem_1fr] items-center gap-x-3 gap-y-1"
                >
                    <img
                        src={STATS[stat].icon}
                        alt=""
                        className="row-span-2 size-8 pixelated"
                    />

                    <div className="flex justify-between text-sm font-semibold">
                        <span>{STATS[stat].label}</span>
                        <span
                            className={cn(
                                'font-bold tabular-nums',
                                pet[stat] < 30 && 'text-destructive',
                            )}
                        >
                            {pet[stat]}
                        </span>
                    </div>

                    <ProgressBar
                        value={pet[stat]}
                        max={100}
                        colorClass={STATS[stat].colorClass}
                        label={STATS[stat].label}
                    />
                </div>
            ))}
        </div>
    );
}
