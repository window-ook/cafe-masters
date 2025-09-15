'use client';

import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores';

export const useCloseSlidingDrawer = () => {
    const router = useRouter();
    const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);

    const handleClose = () => {
        setIsSlidingDrawerOpen(false);
        router.back();
    };

    return handleClose;
};