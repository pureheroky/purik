import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function PetStage({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-lg bg-stage-sky pixel-box',
                className,
            )}
        >
            <div className="absolute inset-x-0 bottom-0 h-16 border-t-[3px] border-ink bg-stage-floor" />
            <div className="relative h-full">{children}</div>
        </div>
    );
}
