'use client';

import { ReactNode, useEffect, useRef, useMemo } from 'react';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { useUserStore } from '@/stores';
import { CONSOLE_ERROR } from '@/utils/constants/messages';

export interface IAuthProvider {
  children: ReactNode;
}

export default function AuthProvider({ children }: IAuthProvider) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const setSession = useUserStore(state => state.setSession);
  const setUserId = useUserStore(state => state.setUserId);
  const setUserEmail = useUserStore(state => state.setUserEmail);
  const setUserNickname = useUserStore(state => state.setUserNickname);
  const setUserGender = useUserStore(state => state.setUserGender);
  const setIsAdmin = useUserStore(state => state.setIsAdmin);
  const resetUser = useUserStore(state => state.resetUser);

  const isInitialized = useRef(false);

  const checkUserInfo = async (userId: string) => {
    const { data, error } = await supabase
      .from('user')
      .select('admin, nickname, gender')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error(CONSOLE_ERROR.CHECK_ADMIN, error.message);
      return { admin: false, nickname: null, gender: null };
    }

    return {
      admin: data?.admin === true,
      nickname: data?.nickname ?? null,
      gender: (data?.gender as 'male' | 'female' | null) ?? null,
    };
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (isInitialized.current) return;

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setSession(session);
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? '');

        const userInfo = await checkUserInfo(session.user.id);
        setIsAdmin(userInfo.admin);
        setUserNickname(userInfo.nickname);
        setUserGender(userInfo.gender);
      }

      isInitialized.current = true;
    };

    initializeUser();

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSession(session);
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? '');

        if (event === 'SIGNED_IN') {
          const userInfo = await checkUserInfo(session.user.id);
          setIsAdmin(userInfo.admin);
          setUserNickname(userInfo.nickname);
          setUserGender(userInfo.gender);
        }
      } else {
        setSession(null);
        resetUser();
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [supabase, setSession, setUserId, setUserEmail, setUserNickname, setUserGender, setIsAdmin, resetUser]);

  return children;
}