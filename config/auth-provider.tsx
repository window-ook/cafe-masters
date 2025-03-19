'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

interface AuthProviderProps {
  accessToken: string;
  children: ReactNode;
}

export default function AuthProvider({
  accessToken,
  children,
}: AuthProviderProps) {
  const supabase = createBrowserSupabaseClient();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const {
      data: { subscription: authListner },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && pathname !== '/') router.replace('/auth');
      if (session?.access_token !== accessToken) router.refresh();
      if (event === 'SIGNED_OUT' || session?.access_token !== accessToken)
        router.refresh();
    });

    return () => authListner.unsubscribe();
  }, [accessToken, supabase, router, pathname]);

  return children;
}
