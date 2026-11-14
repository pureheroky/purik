import { cn } from '@/lib/utils';

export default function ProgressBar({
    value,
    max,
    colorClass,
    label,
}: {
    value: number;
    max: number;
    colorClass: string;
    label: string;
}) {
    const filledBlocks = Math.min(10, Math.ceil((value / max) * 10));

    return (
        <div
            role="meter"
            aria-label={label}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            className="flex gap-0.5 rounded-sm border-2 border-ink bg-card p-0.5"
        >
            {Array.from({ length: 10 }, (_, index) => (
                <div
                    key={index}
                    className={cn(
                        'h-3 flex-1',
                        index < filledBlocks ? colorClass : 'bg-muted',
                    )}
                />
            ))}
        </div>
    );
}
