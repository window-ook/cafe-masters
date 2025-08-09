import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IFilterStore {
  // 검색 키워드, 수집한 카드 중 검색어, 북마크한 카드 중 검색어
  keyword: string;
  searchTermInCollectionCafe: string;
  searchTermInBookmarkCafe: string;

  // 지역/평점/카테고리 필터
  selectedRegion: string;
  selectedRating: string | number;
  selectedCategories: string[];

  setKeyword: (data: string) => void;
  setSearchTermInCollectionCafe: (term: string) => void;
  setSearchTermInBookmarkCafe: (term: string) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedRating: (rating: string | number) => void;
  setSelectedCategories: (categories: string[]) => void;
}

export const useFilterStore = create<IFilterStore>()(
  persist(
    set => ({
      keyword: '성수',
      searchTermInCollectionCafe: '',
      searchTermInBookmarkCafe: '',
      selectedRegion: 'all',
      selectedRating: 'all',
      selectedCategories: [],

      setKeyword: data => set({ keyword: data }),
      setSearchTermInCollectionCafe: term => set({ searchTermInCollectionCafe: term }),
      setSearchTermInBookmarkCafe: term => set({ searchTermInBookmarkCafe: term }),
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