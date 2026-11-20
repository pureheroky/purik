import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STAT_KEYS, STATS } from '@/lib/game';
import type { Item } from '@/types';
import type { RouteFormDefinition } from '@/wayfinder';

const CATEGORIES = ['food', 'toy', 'hygiene', 'energy'];

const fieldClassName =
    'w-full rounded-md border-2 border-input bg-card px-3 py-1.5 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm';

export default function ItemForm({
    form,
    item,
    submitLabel,
}: {
    form: RouteFormDefinition<'post'>;
    item?: Item;
    submitLabel: string;
}) {
    return (
        <Form {...form} className="space-y-5 rounded-lg bg-card p-6 pixel-box">
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={item?.name}
                            maxLength={100}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={item?.description}
                            maxLength={500}
                            rows={3}
                            required
                            className={fieldClassName}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                name="category"
                                defaultValue={item?.category ?? 'food'}
                                className={`${fieldClassName} h-9`}
                            >
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.category} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (coins)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                defaultValue={item?.price ?? 10}
                                min={1}
                                max={1000}
                                required
                            />
                            <InputError message={errors.price} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="effect_stat">Raises stat</Label>
                            <select
                                id="effect_stat"
                                name="effect_stat"
                                defaultValue={item?.effect_stat ?? 'satiety'}
                                className={`${fieldClassName} h-9`}
                            >
                                {STAT_KEYS.map((stat) => (
                                    <option key={stat} value={stat}>
                                        {STATS[stat].label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.effect_stat} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="effect_value">By how much</Label>
                            <Input
                                id="effect_value"
                                name="effect_value"
                                type="number"
                                defaultValue={item?.effect_value ?? 15}
                                min={1}
                                max={100}
                                required
                            />
                            <InputError message={errors.effect_value} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image_path">Picture</Label>
                        <Input
                            id="image_path"
                            name="image_path"
                            defaultValue={item?.image_path ?? ''}
                            placeholder="/images/items/apple.png"
                            maxLength={255}
                        />
                        <InputError message={errors.image_path} />
                    </div>

                    <Button disabled={processing}>{submitLabel}</Button>
                </>
            )}
        </Form>
    );
}
