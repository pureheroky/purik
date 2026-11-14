import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { STATS } from '@/lib/game';
import { action as petAction } from '@/routes/pet';
import type { PetAction, PetStat } from '@/types';

const ACTIONS: {
    key: PetAction;
    label: string;
    stat: PetStat;
    hint: string;
}[] = [
    { key: 'feed', label: 'Feed', stat: 'satiety', hint: '+20 satiety' },
    {
        key: 'play',
        label: 'Play',
        stat: 'happiness',
        hint: '+20 happiness, -15 energy',
    },
    {
        key: 'sleep',
        label: 'Sleep',
        stat: 'energy',
        hint: '+30 energy, -10 satiety',
    },
    {
        key: 'clean',
        label: 'Clean',
        stat: 'cleanliness',
        hint: '+30 cleanliness',
    },
];

export default function PetActions() {
    const [processing, setProcessing] = useState(false);

    function performAction(action: PetAction) {
        router.post(
            petAction.url(),
            { action },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onError: (errors) => toast.error(errors.action),
            },
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {ACTIONS.map((action) => (
                <Button
                    key={action.key}
                    variant="outline"
                    className="h-auto flex-col gap-1 py-3 whitespace-normal"
                    disabled={processing}
                    onClick={() => performAction(action.key)}
                >
                    <img
                        src={STATS[action.stat].icon}
                        alt=""
                        className="size-8 pixelated"
                    />
                    <span className="font-pixel text-lg font-semibold">
                        {action.label}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                        {action.hint}
                    </span>
                </Button>
            ))}
        </div>
    );
}
