import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IFilterStore {
  // 검색 키워드, 수집한 카드 중 검색어, 북마크한 카드 중 검색어
  keyword: string;
  searchTermInCollectedCafe: string;
  searchTermInBookmarkedCafe: string;

  // 지역/평점/카테고리 필터
  selectedRegion: string;
  selectedRating: string | number;
  selectedCategories: string[];

  setKeyword: (data: string) => void;
  setSearchTermInCollectedCafe: (term: string) => void;
  setSearchTermInBookmarkedCafe: (term: string) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedRating: (rating: string | number) => void;
  setSelectedCategories: (categories: string[]) => void;
}

export const useFilterStore = create<IFilterStore>()(
  persist(
    set => ({
      keyword: '성수',
      searchTermInCollectedCafe: '',
      searchTermInBookmarkedCafe: '',
      selectedRegion: 'all',
      selectedRating: 'all',
      selectedCategories: [],

      setKeyword: data => set({ keyword: data }),
      setSearchTermInCollectedCafe: term => set({ searchTermInCollectedCafe: term }),
      setSearchTermInBookmarkedCafe: term => set({ searchTermInBookmarkedCafe: term }),
      setSelectedRegion: region => set({ selectedRegion: region }),
      setSelectedRating: rating => set({ selectedRating: rating }),
      setSelectedCategories: categories => set({ selectedCategories: categories }),
    }),
    {
      name: 'filterStore',
      partialize: (state) => ({ keyword: state.keyword }),
    },
  ),
);