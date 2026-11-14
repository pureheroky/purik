import { Form, Head } from '@inertiajs/react';
import PetStage from '@/components/game/pet-stage';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { create, store } from '@/routes/pet';

export default function CreatePet() {
    return (
        <>
            <Head title="Meet your cat" />

            <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-4 lg:p-6">
                <PetStage>
                    <div className="flex justify-center pt-8 pb-4">
                        <img
                            src="/images/pet/normal.png"
                            alt="Your new cat"
                            className="size-48 pixelated motion-safe:animate-hop sm:size-64"
                        />
                    </div>
                </PetStage>

                <div className="rounded-lg bg-card p-6 pixel-box">
                    <div className="mb-5 space-y-1">
                        <h1 className="font-pixel text-3xl font-semibold">
                            Meet your new cat
                        </h1>
                        <p className="text-muted-foreground">
                            Give it a name to start playing. You can change it
                            later.
                        </p>
                    </div>

                    <Form {...store.form()} className="space-y-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        maxLength={50}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <Button
                                    className="w-full"
                                    disabled={processing}
                                >
                                    Start playing
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

CreatePet.layout = {
    breadcrumbs: [
        {
            title: 'Meet your cat',
            href: create(),
        },
    ],
};
