'use client';

import { ReactNode, useEffect, useRef, useMemo } from 'react';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { useUserStore } from '@/stores';
import { CONSOLE_ERROR } from '@/utils/constants/messages';

interface IAuthProvider {
  initialUserId?: string | null;
  initialUserEmail?: string | null;
  initialUserNickname?: string | null;
  initialUserGender?: 'male' | 'female' | null;
  initialIsAdmin?: boolean;
  children: ReactNode;
}

export default function AuthProvider({
  initialUserId,
  initialUserEmail,
  initialUserNickname,
  initialUserGender,
  initialIsAdmin,
  children,
}: IAuthProvider) {
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
      if (!isInitialized.current && initialUserId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setSession(session);

        setUserId(initialUserId);
        if (initialUserEmail) setUserEmail(initialUserEmail);
        if (initialUserNickname !== undefined) setUserNickname(initialUserNickname);
        if (initialUserGender !== undefined) setUserGender(initialUserGender);

        if (initialIsAdmin !== undefined && initialUserNickname !== undefined && initialUserGender !== undefined) {
          setIsAdmin(initialIsAdmin);
        } else {
          const userInfo = await checkUserInfo(initialUserId);
          setIsAdmin(userInfo.admin);
          if (initialUserNickname === undefined) setUserNickname(userInfo.nickname);
          if (initialUserGender === undefined) setUserGender(userInfo.gender);
        }

        isInitialized.current = true;
      }
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
  }, [supabase, setSession, setUserId, setUserEmail, setUserNickname, setUserGender, setIsAdmin, resetUser, initialUserId, initialUserEmail, initialUserNickname, initialUserGender, initialIsAdmin]);

  return children;
}