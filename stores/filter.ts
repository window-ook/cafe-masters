import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterStore {
  // 검색 관련 상태
  keyword: string;
  searchTermInCollectedCafe: string;
  searchTermInBookmarkedCafe: string;
  
  // 필터 관련 상태
  selectedRegion: string;
  selectedRating: string | number;
  
  // 검색 액션
  setKeyword: (data: string) => void;
  setSearchTermInCollectedCafe: (term: string) => void;
  setSearchTermInBookmarkedCafe: (term: string) => void;
  
  // 필터 액션
  setSelectedRegion: (region: string) => void;
  setSelectedRating: (rating: string | number) => void;
  
  // 필터 초기화 액션
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>()(
  persist(
    set => ({
      // 검색 상태 초기값
      keyword: '성수',
      searchTermInCollectedCafe: '',
      searchTermInBookmarkedCafe: '',
      
      // 필터 상태 초기값
      selectedRegion: 'all',
      selectedRating: 'all',

      // 검색 액션
      setKeyword: data => set({ keyword: data }),
      setSearchTermInCollectedCafe: term => set({ searchTermInCollectedCafe: term }),
      setSearchTermInBookmarkedCafe: term => set({ searchTermInBookmarkedCafe: term }),
      
      // 필터 액션
      setSelectedRegion: region => set({ selectedRegion: region }),
      setSelectedRating: rating => set({ selectedRating: rating }),
      
      // 필터 초기화
      resetFilters: () => set({
        selectedRegion: 'all',
        selectedRating: 'all',
        searchTermInCollectedCafe: '',
        searchTermInBookmarkedCafe: '',
      }),
    }),
    {
      name: 'filterStore',
    },
  ),
);