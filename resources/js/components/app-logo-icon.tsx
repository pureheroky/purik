import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/pet/happy.png"
            alt=""
            {...props}
            className={cn('pixelated', className)}
        />
    );
}
