import { create } from 'zustand';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';

export interface IFormDataForCollect {
  id: number;
  name: string;
  coordX: number;
  coordY: number;
  address: string;
  image: string;
  extra_images: string[];
  phone_number?: string | null;
  opening_time?: string | null;
}

interface ICollectionStore {
  targetCafe: IFormDataForCollect | null;
  editingCafe: ISupabaseCollectedCafe | null;

  setTargetCafe: (cafe: IFormDataForCollect) => void;
  clearTargetCafe: () => void;
  setEditingCafe: (cafe: ISupabaseCollectedCafe | null) => void;
  clearEditingCafe: () => void;
}

export const useCollectionStore = create<ICollectionStore>((set) => ({
  targetCafe: null,
  editingCafe: null,

  setTargetCafe: (cafe: IFormDataForCollect) => set({ targetCafe: cafe }),
  clearTargetCafe: () => set({ targetCafe: null }),
  setEditingCafe: (cafe: ISupabaseCollectedCafe | null) => set({ editingCafe: cafe }),
  clearEditingCafe: () => set({ editingCafe: null }),
}));