import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col items-center gap-6">
                <Link
                    href={home()}
                    className="flex flex-col items-center gap-2"
                >
                    <AppLogoIcon className="size-32 motion-safe:animate-hop" />
                    <span className="font-pixel text-3xl font-semibold">
                        PURIK
                    </span>
                </Link>

                <div className="w-full rounded-lg bg-card p-6 pixel-box sm:p-8">
                    <div className="mb-6 space-y-1 text-center">
                        <h1 className="font-pixel text-2xl font-semibold">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
