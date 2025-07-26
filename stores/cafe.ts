import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IKakaoSearchResult } from '@/types/kakao-map/kakao-map';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';

interface ICafeStore {
    // 검색 결과 카페 데이터
    searchResult: IKakaoSearchResult[];

    // 카테고리 필터링 카페 데이터
    filteredCollectedCafe: ISupabaseCollectedCafe[];
    filteredBookmarkedCafe: ISupabaseBookmarkedCafe[];
    filteredRecommendedCafe: ISupabaseRecommendedCafe[];

    setSearchResult: (data: IKakaoSearchResult[]) => void;
    setFilteredCollectedCafe: (data: ISupabaseCollectedCafe[]) => void;
    setFilteredBookmarkedCafe: (data: ISupabaseBookmarkedCafe[]) => void;
    setFilteredRecommendedCafe: (data: ISupabaseRecommendedCafe[]) => void;
}

export const useCafeStore = create<ICafeStore>()(
    persist(
        set => ({
            searchResult: [],
            filteredCollectedCafe: [],
            filteredBookmarkedCafe: [],
            filteredRecommendedCafe: [],

            setSearchResult: (data: IKakaoSearchResult[]) => set({ searchResult: data }),
            setFilteredCollectedCafe: (data: ISupabaseCollectedCafe[]) => set({ filteredCollectedCafe: data }),
            setFilteredBookmarkedCafe: (data: ISupabaseBookmarkedCafe[]) => set({ filteredBookmarkedCafe: data }),
            setFilteredRecommendedCafe: (data: ISupabaseRecommendedCafe[]) => set({ filteredRecommendedCafe: data }),
        }),
        { name: 'cafeStore' },
    ),
); 