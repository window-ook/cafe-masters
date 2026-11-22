import { create } from 'zustand';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';

/** 수정 폼에 넘길 카드. 새 수집은 폼 없이 1탭으로 하므로 수정 대상만 둡니다 */
interface ICollectionStore {
  editingCafe: ISupabaseCollectionCafe | null;

  setEditingCafeForCollect: (cafe: ISupabaseCollectionCafe | null) => void;
  clearEditingCafe: () => void;
}

export const useCollectionStore = create<ICollectionStore>((set) => ({
  editingCafe: null,

  setEditingCafeForCollect: (cafe: ISupabaseCollectionCafe | null) => set({ editingCafe: cafe }),
  clearEditingCafe: () => set({ editingCafe: null }),
}));
