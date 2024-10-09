import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MapState {
  keyword: string;
  results: any[];
  setKeyword: (keyword: string) => void;
  setResults: (results: any[]) => void;
}

export const useMapStore = create(
  persist(
    (set) => ({
      keyword: '서울숲',
      results: [],
      setKeyword: (newKeyword) => set({ keyword: newKeyword }),
      setResults: (newResults) => set({ results: newResults }),
    }),
    {
      name: 'mapStore',
      getStorage: () => localStorage,
      partialize: (state) => ({
        keyword: state.keyword,
        results: state.results,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
      }),
    }
  )
);
