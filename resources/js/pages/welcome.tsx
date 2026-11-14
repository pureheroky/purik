import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLogo from '@/components/app-logo';
import PetStage from '@/components/game/pet-stage';
import { Button } from '@/components/ui/button';
import { EMOTION_TEXT, STATS } from '@/lib/game';
import type { Emotion } from '@/lib/game';
import { game, home, login, register } from '@/routes';
import type { PetStat } from '@/types';

const EMOTIONS: Emotion[] = [
    'happy',
    'hungry',
    'tired',
    'dirty',
    'sad',
    'normal',
];

const CARE_ACTIONS: { name: string; stat: PetStat; text: string }[] = [
    {
        name: 'Feed',
        stat: 'satiety',
        text: 'Fills its belly. Hunger comes back the fastest.',
    },
    {
        name: 'Play',
        stat: 'happiness',
        text: 'Cheers it up, but playing takes some energy.',
    },
    {
        name: 'Sleep',
        stat: 'energy',
        text: 'Brings the energy back. It wakes up a little hungry.',
    },
    {
        name: 'Clean',
        stat: 'cleanliness',
        text: 'A bath keeps the fur clean and fluffy.',
    },
];

const SHOP_ITEMS = [
    'apple',
    'steak',
    'ball',
    'teddy-bear',
    'soap',
    'shampoo',
    'vitamins',
    'energy-drink',
];

export default function Welcome() {
    const { auth } = usePage().props;
    const [emotionIndex, setEmotionIndex] = useState(0);
    const emotion = EMOTIONS[emotionIndex];

    useEffect(() => {
        const timer = setInterval(() => {
            setEmotionIndex((index) => (index + 1) % EMOTIONS.length);
        }, 2500);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Raise a pixel cat" />

            <div className="min-h-screen bg-background">
                <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
                    <Link href={home()} className="flex items-center gap-2">
                        <AppLogo />
                    </Link>

                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Button asChild>
                                <Link href={game()}>Play</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost">
                                    <Link href={login()}>Log in</Link>
                                </Button>
                                <Button asChild>
                                    <Link href={register()}>Sign up</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto max-w-6xl px-6 pb-10">
                    <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
                        <div className="space-y-6">
                            <h1 className="font-pixel text-5xl leading-none font-bold sm:text-6xl">
                                Raise a tiny pixel cat.
                            </h1>
                            <p className="max-w-md text-lg text-muted-foreground">
                                Feed it, play with it, put it to bed and give it
                                baths. Its needs grow while you are away, so
                                come back and check on it.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {auth.user ? (
                                    <Button asChild size="lg">
                                        <Link href={game()}>Go to my cat</Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild size="lg">
                                            <Link href={register()}>
                                                Adopt a cat
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="outline"
                                        >
                                            <Link href={login()}>
                                                I already have one
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <PetStage>
                            <div className="flex flex-col items-center gap-6 p-5 sm:p-8">
                                <p
                                    aria-live="polite"
                                    className="rounded-md bg-card px-4 py-1 font-pixel text-xl font-semibold pixel-box"
                                >
                                    {EMOTION_TEXT[emotion]}
                                </p>
                                <img
                                    src={`/images/pet/${emotion}.png`}
                                    alt=""
                                    className="size-48 pixelated motion-safe:animate-hop sm:size-64"
                                />
                            </div>
                        </PetStage>
                    </section>

                    <section className="space-y-6 py-10">
                        <div className="max-w-xl space-y-2">
                            <h2 className="font-pixel text-3xl font-semibold">
                                Four ways to care
                            </h2>
                            <p className="text-muted-foreground">
                                Each action earns XP and coins. Every new level
                                gives you a coin bonus.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {CARE_ACTIONS.map((action) => (
                                <div
                                    key={action.name}
                                    className="space-y-2 rounded-lg bg-card p-5 pixel-box"
                                >
                                    <img
                                        src={STATS[action.stat].icon}
                                        alt=""
                                        className="size-12 pixelated"
                                    />
                                    <h3 className="font-pixel text-2xl font-semibold">
                                        {action.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {action.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid items-center gap-8 py-10 lg:grid-cols-[1fr_2fr]">
                        <div className="space-y-2">
                            <h2 className="font-pixel text-3xl font-semibold">
                                Treats from the shop
                            </h2>
                            <p className="text-muted-foreground">
                                Spend your coins on snacks, toys, soap and
                                energy drinks when your cat needs a quick boost.
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-card pixel-box">
                            <div className="grid grid-cols-4 gap-4 p-6 sm:grid-cols-8">
                                {SHOP_ITEMS.map((item) => (
                                    <img
                                        key={item}
                                        src={`/images/items/${item}.png`}
                                        alt=""
                                        className="mx-auto size-16 pixelated"
                                    />
                                ))}
                            </div>
                            <div className="h-4 border-t-[3px] border-ink bg-stage-floor" />
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
