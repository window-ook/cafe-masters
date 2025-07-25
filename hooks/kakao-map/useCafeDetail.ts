import { useSuspenseQuery } from '@tanstack/react-query';

export function useCafeDetail(id: string) {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const detailUrl = BASE_URL === 'http://localhost:3000'
        ? `/api/extra/${id}`
        : `/api/extra/product/${id}`;

    return useSuspenseQuery({
        queryKey: ['cafe-detail', id],
        queryFn: async () => {
            const response = await fetch(detailUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('카페 정보를 불러올 수 없습니다.');
            return response.json();
        },
        staleTime: 1000 * 60 * 5, // 5분간 신선한 데이터로 취급
        gcTime: 1000 * 60 * 30,   // 30분간 캐시 유지
    });
}