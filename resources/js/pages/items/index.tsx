import { Head, Link } from '@inertiajs/react';
import ItemImage from '@/components/shop/item-image';
import { Button } from '@/components/ui/button';
import { STATS } from '@/lib/game';
import { create, edit, index, show } from '@/routes/items';
import type { Item } from '@/types';

export default function ItemsIndex({ items }: { items: Item[] }) {
    return (
        <>
            <Head title="Manage items" />

            <div className="space-y-6 p-4 lg:p-6">
                <header className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="font-pixel text-3xl font-semibold">
                            Manage items
                        </h1>
                        <p className="text-muted-foreground">
                            Add, change or remove the items sold in the shop.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={create()}>New item</Link>
                    </Button>
                </header>

                <div className="overflow-x-auto rounded-lg bg-card pixel-box">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b-[3px] border-ink bg-muted">
                            <tr>
                                <th className="p-3">Item</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Effect</th>
                                <th className="p-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-muted-foreground"
                                    >
                                        There are no items yet.
                                    </td>
                                </tr>
                            )}

                            {items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-border last:border-0"
                                >
                                    <td className="p-3">
                                        <Link
                                            href={show(item)}
                                            className="flex items-center gap-3 font-semibold hover:underline"
                                        >
                                            <ItemImage
                                                item={item}
                                                className="size-8 shrink-0"
                                            />
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td className="p-3">{item.category}</td>
                                    <td className="p-3 font-bold">
                                        {item.price}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        +{item.effect_value}{' '}
                                        {STATS[
                                            item.effect_stat
                                        ].label.toLowerCase()}
                                    </td>
                                    <td className="p-3 text-right">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link href={edit(item)}>Edit</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

ItemsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Manage items',
            href: index(),
        },
    ],
};
