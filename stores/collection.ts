import { create } from 'zustand';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';

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
  targetCafeForCollect: IFormDataForCollect | null;
  editingCafe: ISupabaseCollectionCafe | null;

  setTargetCafeForCollect: (cafe: IFormDataForCollect) => void;
  clearTargetCafe: () => void;
  setEditingCafeForCollect: (cafe: ISupabaseCollectionCafe | null) => void;
  clearEditingCafe: () => void;
}

export const useCollectionStore = create<ICollectionStore>((set) => ({
  targetCafeForCollect: null,
  editingCafe: null,

  setTargetCafeForCollect: (cafe: IFormDataForCollect) => set({ targetCafeForCollect: cafe }),
  clearTargetCafe: () => set({ targetCafeForCollect: null }),
  setEditingCafeForCollect: (cafe: ISupabaseCollectionCafe | null) => set({ editingCafe: cafe }),
  clearEditingCafe: () => set({ editingCafe: null }),
}));