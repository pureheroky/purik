import { getEmotion } from '@/lib/game';
import { cn } from '@/lib/utils';
import type { Pet } from '@/types';

export default function PetCharacter({
    pet,
    className,
}: {
    pet: Pet;
    className?: string;
}) {
    const emotion = getEmotion(pet);

    return (
        <img
            src={`/images/pet/${emotion}.png`}
            alt={`${pet.name} looks ${emotion}`}
            className={cn('pixelated', className)}
        />
    );
}
