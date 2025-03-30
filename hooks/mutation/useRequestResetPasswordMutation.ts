import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useRequestResetPasswordMutation() {
  const supabase = createBrowserSupabaseClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_API_REQUEST_URI}/resetpassword`,
      });
      if (error) throw new Error(error.message);
      return '이메일의 보관함을 확인해주세요.';
    },

    onError: error => {
      console.error(error, error.message);
      alert('재요청은 이전 요청 60초 후 가능합니다.');
    },
  });
}
