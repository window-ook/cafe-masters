import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useSigninMutation() {
  const supabase = createBrowserSupabaseClient();

  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
    },

    onSuccess: async () => {
      await supabase.auth.refreshSession();
      router.replace('/cafe');
    },

    onError: error => {
      if (error) alert(error.message);
      else alert('서버에 에러가 발생했습니다.');
    },
  });
}
