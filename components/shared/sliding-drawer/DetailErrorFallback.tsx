'use client';

import { useRouter } from "next/navigation";
import { useUIStore } from '@/stores';
import { CircleX } from "lucide-react";

export default function DetailErrorFallback() {
    const router = useRouter();

    const setIsSlidingDrawerOpen = useUIStore(state => state.setIsSlidingDrawerOpen);

    const handleClose = () => {
        setIsSlidingDrawerOpen(false);
        router.back();
    };

    return (
        <div className={`h-full flex flex-col`}>
            {/* 헤더 */}
            <header className={`flex justify-between items-center rounded-md p-2`}>
                <div className="flex justify-between items-center p-4 w-full">
                    <button onClick={handleClose}>
                        <CircleX className='size-8' />
                    </button>
                </div>
            </header>

            {/* 에러 메시지 */}
            <main className={`overflow-y-auto shadow-md rounded-md p-2 flex-1 flex flex-col gap-4`}>
                <div className="p-4 space-y-6 flex flex-col items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                        <p className="text-lg font-medium mb-2">카페 정보를 찾을 수 없습니다</p>
                    </div>
                </div>
            </main>
        </div>
    );
}