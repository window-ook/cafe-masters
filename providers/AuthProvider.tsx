'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { useUserStore } from '@/stores';
import { CONSOLE_ERROR } from '@/constants/messages';

interface IAuthProvider {
  accessToken: string | null;
  initialUserId?: string | null;
  initialUserEmail?: string | null;
  initialIsAdmin?: boolean;
  children: ReactNode;
}

export default function AuthProvider({
  accessToken,
  initialUserId,
  initialUserEmail,
  initialIsAdmin,
  children,
}: IAuthProvider) {
  const supabase = createBrowserSupabaseClient();

  const { setUserId, setUserEmail, setIsAdmin, resetUser } = useUserStore();

  const isInitialized = useRef(false);

  const checkIsAdmin = async (userId: string) => {
    try {
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
    } catch (error) {
      console.error(CONSOLE_ERROR.CHECK_ADMIN, error instanceof Error ? error.message : error);
      return false;
    }
  };

  useEffect(() => {
    if (!isInitialized.current && initialUserId) {
      setUserId(initialUserId);
      if (initialUserEmail) setUserEmail(initialUserEmail);
      if (initialIsAdmin) setIsAdmin(initialIsAdmin);
      isInitialized.current = true;
    }

    const {
      data: { subscription: authListener }, } = supabase.auth.onAuthStateChange(async (event, session) => {
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
    }
  }, [accessToken, supabase, setUserId, setUserEmail, setIsAdmin, resetUser, initialUserId, initialUserEmail, initialIsAdmin]);

  return children;
}