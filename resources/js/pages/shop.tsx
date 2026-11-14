import { Form, Head } from '@inertiajs/react';
import { toast } from 'sonner';
import ItemCard from '@/components/shop/item-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { shop } from '@/routes';
import { purchase } from '@/routes/shop';
import type { Item } from '@/types';

export default function Shop({ items }: { items: Item[] }) {
    return (
        <>
            <Head title="Shop" />

            <div className="space-y-6 p-4 lg:p-6">
                <header className="space-y-1">
                    <h1 className="font-pixel text-3xl font-semibold">Shop</h1>
                    <p className="max-w-xl text-muted-foreground">
                        Spend the coins your cat earns. Bought items go to your
                        inventory, and you can use them any time.
                    </p>
                </header>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item}>
                            <Form
                                {...purchase.form()}
                                options={{ preserveScroll: true }}
                                onError={(errors) =>
                                    toast.error(Object.values(errors)[0])
                                }
                                className="flex gap-2"
                            >
                                {({ processing }) => (
                                    <>
                                        <input
                                            type="hidden"
                                            name="item_id"
                                            value={item.id}
                                        />
                                        <Input
                                            type="number"
                                            name="quantity"
                                            aria-label="Quantity"
                                            defaultValue={1}
                                            min={1}
                                            max={99}
                                            className="w-16 font-bold"
                                        />
                                        <Button
                                            className="flex-1"
                                            disabled={processing}
                                        >
                                            Buy for {item.price}
                                            <img
                                                src="/images/icons/coin.png"
                                                alt="coins"
                                                className="size-4 pixelated"
                                            />
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </ItemCard>
                    ))}
                </div>
            </div>
        </>
    );
}

Shop.layout = {
    breadcrumbs: [
        {
            title: 'Shop',
            href: shop(),
        },
    ],
};
