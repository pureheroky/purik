import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { STATS } from '@/lib/game';
import { inventory, shop } from '@/routes';
import { apply } from '@/routes/inventory';
import type { InventoryItem } from '@/types';

export default function PetItems({
    inventoryItems,
}: {
    inventoryItems: InventoryItem[];
}) {
    const [processing, setProcessing] = useState(false);

    function applyItem(itemId: number) {
        router.post(
            apply.url(),
            { item_id: itemId },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onError: (errors) => toast.error(Object.values(errors)[0]),
            },
        );
    }

    return (
        <section className="space-y-1 rounded-lg bg-card px-4 pt-3 pb-2 pixel-box">
            <div className="flex items-baseline justify-between">
                <h2 className="font-pixel text-xl font-semibold">Items</h2>
                <Link
                    href={inventory()}
                    className="text-sm font-semibold text-muted-foreground underline-offset-4 hover:underline"
                >
                    Inventory
                </Link>
            </div>

            {inventoryItems.length === 0 ? (
                <p className="pb-1 text-sm text-muted-foreground">
                    You have no items yet.{' '}
                    <Link
                        href={shop()}
                        className="font-semibold text-foreground underline underline-offset-4"
                    >
                        Visit the shop
                    </Link>
                </p>
            ) : (
                <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pt-2 pb-2">
                    {inventoryItems.map(({ id, item, quantity }) => (
                        <Button
                            key={id}
                            variant="outline"
                            title={`Use ${item.name}: +${item.effect_value} ${STATS[item.effect_stat].label.toLowerCase()}`}
                            className="relative h-auto w-20 shrink-0 flex-col gap-1 px-1 py-2"
                            disabled={processing}
                            onClick={() => applyItem(item.id)}
                        >
                            <img
                                src={item.image_path ?? undefined}
                                alt={item.name}
                                className="size-10 pixelated"
                            />
                            <span className="flex items-center gap-0.5 text-xs font-bold">
                                <img
                                    src={STATS[item.effect_stat].icon}
                                    alt=""
                                    className="size-3 pixelated"
                                />
                                +{item.effect_value}
                            </span>
                            <span className="absolute -top-2 -right-2 rounded-sm border-2 border-ink bg-card px-1 text-xs font-bold tabular-nums">
                                x{quantity}
                            </span>
                        </Button>
                    ))}
                </div>
            )}
        </section>
    );
}
