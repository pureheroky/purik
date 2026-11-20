import { Head } from '@inertiajs/react';
import ItemForm from '@/components/items/item-form';
import { create, index, store } from '@/routes/items';

export default function CreateItem() {
    return (
        <>
            <Head title="New item" />

            <div className="mx-auto w-full max-w-xl space-y-6 p-4 lg:p-6">
                <h1 className="font-pixel text-3xl font-semibold">New item</h1>

                <ItemForm form={store.form()} submitLabel="Add to the shop" />
            </div>
        </>
    );
}

CreateItem.layout = {
    breadcrumbs: [
        {
            title: 'Manage items',
            href: index(),
        },
        {
            title: 'New item',
            href: create(),
        },
    ],
};
