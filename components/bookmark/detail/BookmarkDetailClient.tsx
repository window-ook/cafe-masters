'use client';

import { use, useEffect } from 'react';
import { useCurrentCafeStore, useUserStore } from '@/stores';
import { useCollectionCafes } from '@/hooks/supabase/collection';
import { useRecommendationCafes } from '@/hooks/supabase/recommendation';

export default function BookmarkDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const numericId = Number(id);

    const userId = useUserStore(state => state.userId);
    const setIsCollected = useCurrentCafeStore(state => state.setIsCollected);
    const setIsRecommended = useCurrentCafeStore(state => state.setIsRecommended);

    const { collectionCafes } = useCollectionCafes(userId, true);
    const { recommendationCafes } = useRecommendationCafes();

    useEffect(() => {
        if (!numericId) return;

        // 현재 상태와 비교하여 실제 변경이 있을 때만 업데이트
        const isCollected = collectionCafes.some(cafe => cafe.id === numericId);
        const isRecommended = recommendationCafes?.some(cafe => cafe.id === numericId) || false;

        const updateStates = () => {
            setIsCollected(isCollected);
            setIsRecommended(isRecommended);
        };

        // 중복 호출 방지
        const timeoutId = setTimeout(updateStates, 0);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numericId, collectionCafes, recommendationCafes]);

    return null;
}