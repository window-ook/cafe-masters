import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IKakaoSearchResult } from '@/types/kakao-map/kakao-map';
import { ISupabaseBookmarkedCafe } from '@/types/supabase/bookmark';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';
import { ISupabaseRecommendedCafe } from '@/types/supabase/recommendation';
import { ICafeDetail } from '@/types/kakao-map/kakao-map';

interface ICafeStore {
    // 🏪 카페 데이터
    searchResult: IKakaoSearchResult[];
    collectedCafe: ISupabaseCollectedCafe[];
    filteredCollectedCafe: ISupabaseCollectedCafe[];
    bookmarkedCafe: ISupabaseBookmarkedCafe[];
    filteredBookmarkedCafe: ISupabaseBookmarkedCafe[];
    recommendedCafe: ISupabaseRecommendedCafe[];
    filteredRecommendedCafe: ISupabaseRecommendedCafe[];

    // 📊 카페 카운트
    collectedCafeCount: number;
    bookmarkedCafeCount: number;
    recommendedCafeCount: number;

    // 📝 카페 상세 정보
    cafeDetail: ICafeDetail;
    collectedCafeDetail: ISupabaseCollectedCafe[];
    bookmarkedCafeDetail: ISupabaseBookmarkedCafe[];
    recommendedCafeDetail: ISupabaseRecommendedCafe[];

    // 🎯 카페 데이터 액션
    setSearchResult: (data: IKakaoSearchResult[]) => void;
    setCollectedCafe: (data: ISupabaseCollectedCafe[]) => void;
    setFilteredCollectedCafe: (data: ISupabaseCollectedCafe[]) => void;
    setBookmarkedCafe: (data: ISupabaseBookmarkedCafe[]) => void;
    setFilteredBookmarkedCafe: (data: ISupabaseBookmarkedCafe[]) => void;
    setRecommendedCafe: (data: ISupabaseRecommendedCafe[]) => void;
    setFilteredRecommendedCafe: (data: ISupabaseRecommendedCafe[]) => void;

    // 📊 카페 카운트 액션
    setCollectedCafeCount: (count: number) => void;
    setBookmarkedCafeCount: (count: number) => void;
    setRecommendedCafeCount: (count: number) => void;

    // 📝 카페 상세 정보 액션
    setCafeDetail: (data: ICafeDetail) => void;
    setCollectedCafeDetail: (data: ISupabaseCollectedCafe[]) => void;
    setBookmarkedCafeDetail: (data: ISupabaseBookmarkedCafe[]) => void;
    setRecommendedCafeDetail: (data: ISupabaseRecommendedCafe[]) => void;
}

export const useCafeStore = create<ICafeStore>()(
    persist(
        set => ({
            // 🏪 카페 데이터 초기값
            searchResult: [],
            collectedCafe: [],
            filteredCollectedCafe: [],
            bookmarkedCafe: [],
            filteredBookmarkedCafe: [],
            recommendedCafe: [],
            filteredRecommendedCafe: [],

            // 📊 카페 카운트 초기값
            collectedCafeCount: 0,
            bookmarkedCafeCount: 0,
            recommendedCafeCount: 0,

            // 📝 카페 상세 정보 초기값
            cafeDetail: {},
            collectedCafeDetail: [],
            bookmarkedCafeDetail: [],
            recommendedCafeDetail: [],

            // 🎯 카페 데이터 설정
            setSearchResult: (data: IKakaoSearchResult[]) => set({ searchResult: data }),
            setCollectedCafe: (data: ISupabaseCollectedCafe[]) =>
                set({ collectedCafe: data ?? [] }),
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

            // 📊 카페 카운트 설정
            setCollectedCafeCount: count => set({ collectedCafeCount: count }),
            setBookmarkedCafeCount: count => set({ bookmarkedCafeCount: count }),
            setRecommendedCafeCount: count => set({ recommendedCafeCount: count }),

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