'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useUIStore } from '@/stores';

export const useCloseSlidingDrawer = () => {
    const router = useRouter();
    const pathname = usePathname();
    const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);

    const handleClose = () => {
        setIsSlidingDrawerOpen(false);

        const parentPath = pathname.replace(/\/detail\/[^/]+.*$/, '');
        router.push(parentPath);
    };

    return handleClose;
};