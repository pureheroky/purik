import { Head, Link, router } from '@inertiajs/react';
import ItemCard from '@/components/shop/item-card';
import { Button } from '@/components/ui/button';
import { destroy, edit, index } from '@/routes/items';
import type { Item } from '@/types';

export default function ShowItem({
    item,
    ownersCount,
}: {
    item: Item;
    ownersCount: number;
}) {
    function deleteItem() {
        if (
            confirm(
                `Delete ${item.name}? Players who have it will lose it too.`,
            )
        ) {
            router.delete(destroy.url(item));
        }
    }

    return (
        <>
            <Head title={item.name} />

            <div className="mx-auto w-full max-w-sm space-y-4 p-4 lg:p-6">
                <ItemCard item={item}>
                    <dl className="mb-4 grid grid-cols-2 gap-1 text-sm">
                        <dt className="text-muted-foreground">Category</dt>
                        <dd className="font-semibold">{item.category}</dd>
                        <dt className="text-muted-foreground">Price</dt>
                        <dd className="font-semibold">{item.price} coins</dd>
                        <dt className="text-muted-foreground">Owned by</dt>
                        <dd className="font-semibold">
                            {ownersCount}{' '}
                            {ownersCount === 1 ? 'player' : 'players'}
                        </dd>
                    </dl>

                    <div className="flex gap-2">
                        <Button asChild className="flex-1">
                            <Link href={edit(item)}>Edit</Link>
                        </Button>
                        <Button variant="destructive" onClick={deleteItem}>
                            Delete
                        </Button>
                    </div>
                </ItemCard>

                <Link
                    href={index()}
                    className="inline-block text-sm font-semibold text-muted-foreground underline-offset-4 hover:underline"
                >
                    Back to all items
                </Link>
            </div>
        </>
    );
}

ShowItem.layout = {
    breadcrumbs: [
        {
            title: 'Manage items',
            href: index(),
        },
    ],
};
