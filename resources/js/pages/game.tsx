import { Form, Head } from '@inertiajs/react';
import ExperienceBar from '@/components/game/experience-bar';
import PetActions from '@/components/game/pet-actions';
import PetCharacter from '@/components/game/pet-character';
import PetItems from '@/components/game/pet-items';
import PetStage from '@/components/game/pet-stage';
import PetStats from '@/components/game/pet-stats';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EMOTION_TEXT, getEmotion } from '@/lib/game';
import { game } from '@/routes';
import { update } from '@/routes/pet';
import type { InventoryItem, Pet } from '@/types';

export default function Game({
    pet,
    requiredExperience,
    inventoryItems,
}: {
    pet: Pet;
    requiredExperience: number;
    inventoryItems: InventoryItem[];
}) {
    return (
        <>
            <Head title="Game" />

            <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:p-6">
                <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-6 lg:h-[calc(100svh-8rem)] lg:min-h-[30rem] lg:self-start">
                    <PetStage className="h-[26rem] sm:h-[30rem] lg:h-auto lg:min-h-0 lg:flex-1">
                        <div className="flex h-full flex-col gap-4 p-5">
                            <div className="self-start rounded-md bg-card px-4 py-2 pixel-box">
                                <h1 className="font-pixel text-3xl leading-none font-semibold">
                                    {pet.name}
                                </h1>
                                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                                    {EMOTION_TEXT[getEmotion(pet)]}
                                </p>
                            </div>

                            <div className="flex min-h-0 flex-1 items-end justify-center">
                                <PetCharacter
                                    pet={pet}
                                    className="h-full max-h-80 w-auto max-w-full object-contain motion-safe:animate-hop"
                                />
                            </div>
                        </div>
                    </PetStage>

                    <PetItems inventoryItems={inventoryItems} />
                </div>

                <div className="flex flex-col gap-6">
                    <section className="space-y-5 rounded-lg bg-card p-5 pixel-box">
                        <ExperienceBar
                            level={pet.level}
                            experience={pet.experience}
                            requiredExperience={requiredExperience}
                        />
                        <PetStats pet={pet} />
                    </section>

                    <PetActions />

                    <details className="rounded-lg border-2 border-dashed border-ink/40 p-4">
                        <summary className="cursor-pointer text-sm font-semibold">
                            Rename {pet.name}
                        </summary>

                        <Form
                            {...update.form()}
                            options={{ preserveScroll: true }}
                            className="mt-3"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="flex gap-2">
                                        <Input
                                            name="name"
                                            aria-label="New name"
                                            defaultValue={pet.name}
                                            maxLength={50}
                                            required
                                        />
                                        <Button disabled={processing}>
                                            Save
                                        </Button>
                                    </div>

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </>
                            )}
                        </Form>
                    </details>
                </div>
            </div>
        </>
    );
}

Game.layout = {
    breadcrumbs: [
        {
            title: 'Game',
            href: game(),
        },
    ],
};
