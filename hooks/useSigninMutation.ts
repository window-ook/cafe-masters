import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useSigninMutation() {
  const supabase = createBrowserSupabaseClient();

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

    onError: (error: Error) => {
      if (error.message) alert('이메일 또는 비밀번호를 잘못 입력했습니다.');
      else alert('알 수 없는 에러가 발생했습니다.');
    },
  });
}
