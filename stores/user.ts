import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tier } from '@/types/shared/tier';

interface UserStore {
  // 유저 정보 상태
  userId: string;
  userEmail: string;
  userTier: Tier;
  admin: boolean;

  // 유저 정보 액션
  setUserId: (userId: string) => void;
  setUserEmail: (userEmail: string) => void;
  setUserTier: (userTier: Tier) => void;
  setAdmin: (admin: boolean) => void;

  // 유저 정보 초기화
  resetUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      // 유저 상태 초기값
      userId: '',
      userEmail: '',
      userTier: 'BEGINNER',
      admin: false,

      // 유저 정보 설정
      setUserId: userId => set({ userId }),
      setUserEmail: userEmail => set({ userEmail }),
      setUserTier: userTier => set({ userTier }),
      setAdmin: admin => set({ admin }),

      // 유저 정보 초기화 (로그아웃 시 사용)
      resetUser: () => set({
        userId: '',
        userEmail: '',
        userTier: 'BEGINNER',
        admin: false,
      }),
    }),
    {
      name: 'userStore',
    },
  ),
);