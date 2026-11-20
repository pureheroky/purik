import { Head } from '@inertiajs/react';
import ItemForm from '@/components/items/item-form';
import { index, update } from '@/routes/items';
import type { Item } from '@/types';

export default function EditItem({ item }: { item: Item }) {
    return (
        <>
            <Head title={`Edit ${item.name}`} />

            <div className="mx-auto w-full max-w-xl space-y-6 p-4 lg:p-6">
                <h1 className="font-pixel text-3xl font-semibold">
                    Edit {item.name}
                </h1>

                <ItemForm
                    form={update.form(item)}
                    item={item}
                    submitLabel="Save changes"
                />
            </div>
        </>
    );
}

EditItem.layout = {
    breadcrumbs: [
        {
            title: 'Manage items',
            href: index(),
        },
    ],
};
