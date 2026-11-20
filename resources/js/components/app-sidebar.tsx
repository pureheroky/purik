import { Link, usePage } from '@inertiajs/react';
import { Backpack, Gamepad2, PackagePlus, Store } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { game, inventory, shop } from '@/routes';
import { index as items } from '@/routes/items';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Game',
        href: game(),
        icon: Gamepad2,
    },
    {
        title: 'Shop',
        href: shop(),
        icon: Store,
    },
    {
        title: 'Inventory',
        href: inventory(),
        icon: Backpack,
    },
];

const adminNavItem: NavItem = {
    title: 'Manage items',
    href: items(),
    icon: PackagePlus,
};

export function AppSidebar() {
    const { auth } = usePage().props;
    const navItems = auth.user.is_admin
        ? [...mainNavItems, adminNavItem]
        : mainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={game()}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
