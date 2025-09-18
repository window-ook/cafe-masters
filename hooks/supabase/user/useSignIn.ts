'use client';

import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useFilterStore } from '@/stores';
import { useMutation } from '@tanstack/react-query';
import { getAuthErrorMessage } from '@/utils/shared/authError';
import { toast } from 'react-toastify';

export function useSignIn() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      return { session: data.session, error };
    },

    onSuccess: async result => {
      if (result.error) {
        const errorMessage = getAuthErrorMessage(result.error);
        toast.error(errorMessage);
        return;
      }

      useFilterStore.setState({ keyword: '' });

      // 세션 새로고침
      await supabase.auth.refreshSession();
      router.replace('/main');
    },

    onError: error => {
      const errorMessage = getAuthErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  return { signIn: signIn.mutate, isPending: signIn.isPending };
}