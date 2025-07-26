import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IKakaoSearchResult } from '@/types/kakao-map/kakao-map';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';
import { ISearchedCafeDetail } from '@/types/kakao-map/kakao-map';

interface ICafeStore {
    // 🏪 카페 데이터
    searchResult: IKakaoSearchResult[];
    filteredCollectedCafe: ISupabaseCollectedCafe[];
    bookmarkedCafe: ISupabaseBookmarkedCafe[];
    filteredBookmarkedCafe: ISupabaseBookmarkedCafe[];
    recommendedCafe: ISupabaseRecommendedCafe[];
    filteredRecommendedCafe: ISupabaseRecommendedCafe[];

    // 📝 카페 상세 정보
    cafeDetail: ISearchedCafeDetail;
    collectedCafeDetail: ISupabaseCollectedCafe[];
    bookmarkedCafeDetail: ISupabaseBookmarkedCafe[];
    recommendedCafeDetail: ISupabaseRecommendedCafe[];

    // 🎯 카페 데이터 액션
    setSearchResult: (data: IKakaoSearchResult[]) => void;
    setFilteredCollectedCafe: (data: ISupabaseCollectedCafe[]) => void;
    setFilteredBookmarkedCafe: (data: ISupabaseBookmarkedCafe[]) => void;
    setRecommendedCafe: (data: ISupabaseRecommendedCafe[]) => void;
    setFilteredRecommendedCafe: (data: ISupabaseRecommendedCafe[]) => void;

    // 📝 카페 상세 정보 액션
    setCafeDetail: (data: ISearchedCafeDetail) => void;
    setCollectedCafeDetail: (data: ISupabaseCollectedCafe[]) => void;
    setBookmarkedCafeDetail: (data: ISupabaseBookmarkedCafe[]) => void;
    setRecommendedCafeDetail: (data: ISupabaseRecommendedCafe[]) => void;
}

export const useCafeStore = create<ICafeStore>()(
    persist(
        set => ({
            // 🏪 카페 데이터 초기값
            searchResult: [],
            filteredCollectedCafe: [],
            bookmarkedCafe: [],
            filteredBookmarkedCafe: [],
            recommendedCafe: [],
            filteredRecommendedCafe: [],

            // 📝 카페 상세 정보 초기값
            cafeDetail: { image: '', extra_images: [], opening_time: '', menus: [] },
            collectedCafeDetail: [],
            bookmarkedCafeDetail: [],
            recommendedCafeDetail: [],

            // 🎯 카페 데이터 설정
            setSearchResult: (data: IKakaoSearchResult[]) => set({ searchResult: data }),
            setFilteredCollectedCafe: (data: ISupabaseCollectedCafe[]) =>
                set({ filteredCollectedCafe: data ?? [] }),
            setBookmarkedCafe: (data: ISupabaseBookmarkedCafe[]) =>
                set({ bookmarkedCafe: data }),
            setFilteredBookmarkedCafe: (data: ISupabaseBookmarkedCafe[]) =>
                set({ filteredBookmarkedCafe: data }),
            setRecommendedCafe: (data: ISupabaseRecommendedCafe[]) =>
                set({ recommendedCafe: data }),
            setFilteredRecommendedCafe: (data: ISupabaseRecommendedCafe[]) =>
                set({ filteredRecommendedCafe: data }),



            // 📝 카페 상세 정보 설정
            setCafeDetail: data => set({ cafeDetail: data }),
            setCollectedCafeDetail: (data: ISupabaseCollectedCafe[]) =>
                set({ collectedCafeDetail: data }),
            setBookmarkedCafeDetail: (data: ISupabaseBookmarkedCafe[]) =>
                set({ bookmarkedCafeDetail: data }),
            setRecommendedCafeDetail: (data: ISupabaseRecommendedCafe[]) =>
                set({ recommendedCafeDetail: data }),
        }),
        {
            name: 'cafeStore',
        },
    ),
); 