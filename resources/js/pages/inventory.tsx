import { Form, Head, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import PetCharacter from '@/components/game/pet-character';
import PetStats from '@/components/game/pet-stats';
import ItemCard from '@/components/shop/item-card';
import { Button } from '@/components/ui/button';
import { inventory, shop } from '@/routes';
import { apply } from '@/routes/inventory';
import type { InventoryItem, Pet } from '@/types';

export default function Inventory({
    pet,
    inventoryItems,
}: {
    pet: Pet;
    inventoryItems: InventoryItem[];
}) {
    return (
        <>
            <Head title="Inventory" />

            <div className="space-y-6 p-4 lg:p-6">
                <section className="flex flex-col gap-5 rounded-lg bg-card p-5 pixel-box sm:flex-row sm:items-center">
                    <PetCharacter
                        pet={pet}
                        className="size-32 shrink-0 self-center"
                    />

                    <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                            <h1 className="font-pixel text-3xl font-semibold">
                                Inventory
                            </h1>
                            <p className="text-muted-foreground">
                                Pick an item to use it on {pet.name} right away.
                            </p>
                        </div>
                        <PetStats pet={pet} className="sm:grid-cols-2" />
                    </div>
                </section>

                {inventoryItems.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-ink/40 p-10 text-center">
                        <p className="max-w-sm text-muted-foreground">
                            Your inventory is empty. Items you buy in the shop
                            will show up here.
                        </p>
                        <Button asChild>
                            <Link href={shop()}>Go to the shop</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {inventoryItems.map((inventoryItem) => (
                            <ItemCard
                                key={inventoryItem.id}
                                item={inventoryItem.item}
                                quantity={inventoryItem.quantity}
                            >
                                <Form
                                    {...apply.form()}
                                    options={{ preserveScroll: true }}
                                    onError={(errors) =>
                                        toast.error(Object.values(errors)[0])
                                    }
                                >
                                    {({ processing }) => (
                                        <>
                                            <input
                                                type="hidden"
                                                name="item_id"
                                                value={inventoryItem.item_id}
                                            />
                                            <Button
                                                className="w-full"
                                                disabled={processing}
                                            >
                                                Use on {pet.name}
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </ItemCard>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Inventory.layout = {
    breadcrumbs: [
        {
            title: 'Inventory',
            href: inventory(),
        },
    ],
};
