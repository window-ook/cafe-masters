import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from '@supabase/supabase-js';
import { Tier } from '@/types/shared/tier';

interface IUserStore {
  // 인증 상태
  session: Session | null;

  // 유저 정보 상태
  userId: string;
  userEmail: string;
  userNickname: string | null;
  userGender: 'male' | 'female' | null;
  userTier: Tier;
  isAdmin: boolean;

  // 인증 액션
  setSession: (session: Session | null) => void;

  // 유저 정보 액션
  setUserId: (userId: string) => void;
  setUserEmail: (userEmail: string) => void;
  setUserNickname: (nickname: string | null) => void;
  setUserGender: (gender: 'male' | 'female' | null) => void;
  setUserTier: (userTier: Tier) => void;
  setIsAdmin: (isAdmin: boolean) => void;

  // 유저 정보 초기화
  resetUser: () => void;
}

export const useUserStore = create<IUserStore>()(
  persist(
    set => ({
      // 인증 상태 초기값
      session: null,

      // 유저 상태 초기값
      userId: '',
      userEmail: '',
      userNickname: null,
      userGender: null,
      userTier: 'BEGINNER',
      isAdmin: false,

      // 인증 설정
      setSession: session => set({ session }),

      // 유저 정보 설정
      setUserId: userId => set({ userId }),
      setUserEmail: userEmail => set({ userEmail }),
      setUserNickname: nickname => set({ userNickname: nickname }),
      setUserGender: gender => set({ userGender: gender }),
      setUserTier: userTier => set({ userTier }),
      setIsAdmin: isAdmin => set({ isAdmin }),

      // 유저 정보 초기화 (로그아웃 시 사용)
      resetUser: () => set({
        session: null,
        userId: '',
        userEmail: '',
        userNickname: null,
        userGender: null,
        userTier: 'BEGINNER',
        isAdmin: false,
      }),
    }),
    {
      name: 'userStore',
      // 보안: session은 localStorage 저장 제외 (메모리에만 존재)
      partialize: state => ({
        userId: state.userId,
        userEmail: state.userEmail,
        userNickname: state.userNickname,
        userGender: state.userGender,
        userTier: state.userTier,
        isAdmin: state.isAdmin,
      }),
    },
  ),
);