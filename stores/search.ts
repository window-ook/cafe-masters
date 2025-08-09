import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IKakaoSearchResult } from '@/types/kakao-map/kakao-map';

interface ISearchedResultStore {
    searchResult: IKakaoSearchResult[];
    setSearchResult: (data: IKakaoSearchResult[]) => void;
}

export const useSearchedResultStore = create<ISearchedResultStore>()(
    persist(
        set => ({
            searchResult: [],
            setSearchResult: (data: IKakaoSearchResult[]) => set({ searchResult: data }),
        }),
        { name: 'searchedResultStore' },
    )
);