import { usePage } from '@inertiajs/react';

export default function CoinBalance() {
    const { auth } = usePage().props;

    return (
        <div className="flex items-center gap-1 rounded-md border-2 border-ink bg-card py-0.5 pr-3 pl-1 shadow-pixel">
            <img
                src="/images/icons/coin.png"
                alt=""
                className="size-8 pixelated"
            />
            <span className="text-base font-bold tabular-nums">
                {auth.user.coins}
            </span>
            <span className="sr-only">coins</span>
        </div>
    );
}
