import { create } from 'zustand';

interface MapState {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

export const useMapStore = create((set) => ({
  keyword: '',
  results: [],
  setKeyword: (keyword) => set({ keyword }),
  setResults: (results) => set({ results }),
}));
