import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tier } from '@/types/shared/tier';

interface IUserStore {
  // 유저 정보 상태
  userId: string;
  userEmail: string;
  userTier: Tier;
  isAdmin: boolean;

  // 유저 정보 액션
  setUserId: (userId: string) => void;
  setUserEmail: (userEmail: string) => void;
  setUserTier: (userTier: Tier) => void;
  setIsAdmin: (isAdmin: boolean) => void;

  // 유저 정보 초기화
  resetUser: () => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    set => ({
      // 유저 상태 초기값
      userId: '',
      userEmail: '',
      userTier: 'BEGINNER',
      isAdmin: false,

      // 유저 정보 설정
      setUserId: userId => set({ userId }),
      setUserEmail: userEmail => set({ userEmail }),
      setUserTier: userTier => set({ userTier }),
      setIsAdmin: isAdmin => set({ isAdmin }),

      // 유저 정보 초기화 (로그아웃 시 사용)
      resetUser: () => set({
        userId: '',
        userEmail: '',
        userTier: 'BEGINNER',
        isAdmin: false,
      }),
    }),
    {
      name: 'userStore',
    },
  ),
);