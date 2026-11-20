import { cn } from '@/lib/utils';
import type { Item } from '@/types';

export default function ItemImage({
    item,
    className,
}: {
    item: Item;
    className?: string;
}) {
    if (!item.image_path) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center rounded-sm border-2 border-dashed border-ink/40 font-pixel text-muted-foreground',
                    className,
                )}
            >
                ?
            </div>
        );
    }

    return (
        <img
            src={item.image_path}
            alt={item.name}
            className={cn('pixelated', className)}
        />
    );
}
