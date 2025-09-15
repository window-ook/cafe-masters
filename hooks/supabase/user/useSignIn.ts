import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useFilterStore } from '@/stores';
import { useMutation } from '@tanstack/react-query';
import { getAuthErrorMessage } from '@/utils/shared/authError';

export function useSignIn() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      return data.session;
    },

    onSuccess: async session => {
      // 키워드 초기화 (AuthProvider에서 user store는 자동 동기화됨)
      useFilterStore.setState({ keyword: '' });

      // 세션 새로고침
      await supabase.auth.refreshSession();
      router.replace('/main');
    },

    onError: error => {
      const errorMessage = getAuthErrorMessage(error);
      alert(errorMessage);
    },
  });

  return { signIn: signIn.mutate, isPending: signIn.isPending };
}