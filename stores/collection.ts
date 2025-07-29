import { create } from 'zustand';
import { ISupabaseCollectedCafe } from '@/types/supabase/collection';

export interface ITargetCafe {
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
  targetCafe: ITargetCafe | null;
  editingCafe: ISupabaseCollectedCafe | null;

  setTargetCafe: (cafe: ITargetCafe) => void;
  clearTargetCafe: () => void;
  setEditingCafe: (cafe: ISupabaseCollectedCafe | null) => void;
  clearEditingCafe: () => void;
}

export const useCollectionStore = create<ICollectionStore>((set) => ({
  targetCafe: null,
  editingCafe: null,

  setTargetCafe: (cafe: ITargetCafe) => set({ targetCafe: cafe }),
  clearTargetCafe: () => set({ targetCafe: null }),
  setEditingCafe: (cafe: ISupabaseCollectedCafe | null) => set({ editingCafe: cafe }),
  clearEditingCafe: () => set({ editingCafe: null }),
}));