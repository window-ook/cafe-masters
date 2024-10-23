'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

interface AuthProviderProps {
  accessToken: string;
  children: React.PropsWithChildren;
}

export default function AuthProvider({
  accessToken,
  children,
}: AuthProviderProps) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription: authListner },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });

    return () => {
      authListner.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
}
