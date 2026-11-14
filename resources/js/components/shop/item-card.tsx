import type { ReactNode } from 'react';
import { STATS } from '@/lib/game';
import { cn } from '@/lib/utils';
import type { Item } from '@/types';

export default function ItemCard({
    item,
    quantity,
    children,
}: {
    item: Item;
    quantity?: number;
    children: ReactNode;
}) {
    const stat = STATS[item.effect_stat];

    return (
        <div className="flex flex-col overflow-hidden rounded-lg bg-card pixel-box">
            <div className="relative flex justify-center border-b-[3px] border-ink bg-muted py-5">
                <img
                    src={item.image_path ?? undefined}
                    alt={item.name}
                    className="size-32 pixelated"
                />

                {quantity !== undefined && (
                    <span className="absolute top-2 right-2 rounded-sm border-2 border-ink bg-card px-2 font-bold tabular-nums">
                        x{quantity}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-pixel text-xl font-semibold">
                    {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {item.description}
                </p>
                <span
                    className={cn(
                        'flex w-fit items-center gap-1 rounded-sm border-2 border-ink px-1.5 py-0.5 text-xs font-bold text-[#241d34]',
                        stat.colorClass,
                    )}
                >
                    <img src={stat.icon} alt="" className="size-4 pixelated" />
                    <span>
                        +{item.effect_value} {stat.label.toLowerCase()}
                    </span>
                </span>

                <div className="mt-auto pt-3">{children}</div>
            </div>
        </div>
    );
}
