'use client';

import { ReactNode, useEffect, useRef, useMemo } from 'react';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { useUserStore } from '@/stores';
import { CONSOLE_ERROR } from '@/constants/messages';

interface IAuthProvider {
  initialUserId?: string | null;
  initialUserEmail?: string | null;
  initialIsAdmin?: boolean;
  children: ReactNode;
}

export default function AuthProvider({
  initialUserId,
  initialUserEmail,
  initialIsAdmin,
  children,
}: IAuthProvider) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const setUserId = useUserStore(state => state.setUserId);
  const setUserEmail = useUserStore(state => state.setUserEmail);
  const setIsAdmin = useUserStore(state => state.setIsAdmin);
  const resetUser = useUserStore(state => state.resetUser);

  const isInitialized = useRef(false);

  const checkIsAdmin = async (userId: string) => {
    const { data, error } = await supabase
      .from('admin')
      .select('admin')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error(CONSOLE_ERROR.CHECK_ADMIN, error.message);
      return false;
    }

    return data?.admin === true;
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (!isInitialized.current && initialUserId) {
        setUserId(initialUserId);
        if (initialUserEmail) setUserEmail(initialUserEmail);

        if (initialIsAdmin !== undefined) setIsAdmin(initialIsAdmin);
        else {
          const isAdmin = await checkIsAdmin(initialUserId);
          setIsAdmin(isAdmin);
        }

        isInitialized.current = true;
      }
    };

    initializeUser();

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? '');

        if (event === 'SIGNED_IN') {
          const isAdmin = await checkIsAdmin(session.user.id);
          setIsAdmin(isAdmin);
        }
      } else {
        resetUser();
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [supabase, setUserId, setUserEmail, setIsAdmin, resetUser, initialUserId, initialUserEmail, initialIsAdmin]);

  return children;
}