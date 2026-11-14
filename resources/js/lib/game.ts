import type { Pet, PetStat } from '@/types';

export const STATS: Record<
    PetStat,
    { label: string; colorClass: string; icon: string }
> = {
    satiety: {
        label: 'Satiety',
        colorClass: 'bg-satiety',
        icon: '/images/icons/satiety.png',
    },
    happiness: {
        label: 'Happiness',
        colorClass: 'bg-happiness',
        icon: '/images/icons/happiness.png',
    },
    energy: {
        label: 'Energy',
        colorClass: 'bg-energy',
        icon: '/images/icons/energy.png',
    },
    cleanliness: {
        label: 'Cleanliness',
        colorClass: 'bg-cleanliness',
        icon: '/images/icons/cleanliness.png',
    },
};

export const STAT_KEYS = Object.keys(STATS) as PetStat[];

export type Emotion = 'normal' | 'happy' | 'hungry' | 'sad' | 'tired' | 'dirty';

const EMOTION_BY_STAT: Record<PetStat, Emotion> = {
    satiety: 'hungry',
    happiness: 'sad',
    energy: 'tired',
    cleanliness: 'dirty',
};

export const EMOTION_TEXT: Record<Emotion, string> = {
    normal: 'Doing fine',
    happy: 'Very happy',
    hungry: 'Hungry',
    sad: 'Bored and sad',
    tired: 'Sleepy',
    dirty: 'Needs a bath',
};

export function getEmotion(pet: Pet): Emotion {
    const lowestStat = [...STAT_KEYS].sort((a, b) => pet[a] - pet[b])[0];

    if (pet[lowestStat] < 30) {
        return EMOTION_BY_STAT[lowestStat];
    }

    if (pet[lowestStat] >= 70) {
        return 'happy';
    }

    return 'normal';
}
