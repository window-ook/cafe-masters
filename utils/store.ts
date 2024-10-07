import { create } from 'zustand';

interface MapState {
  keyword: string;
  results: any[];
  setKeyword: (keyword: string) => void;
  setResults: (results: any[]) => void;
}

export const useMapStore = create((set) => ({
  keyword: '성수',
  results: [],
  setKeyword: (keyword) => set({ keyword }),
  setResults: (results) => set({ results }),
}));
