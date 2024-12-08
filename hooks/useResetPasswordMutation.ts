import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useResetPasswordMutation() {
  const supabase = createBrowserSupabaseClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_API_REQUEST_URI}/resetpassword`,
      });
      if (error) throw new Error(error.message);
      return '이메일의 보관함을 확인해주세요.';
    },

    onError: (error: Error) => {
      console.error(error, error.message);
      alert('재요청은 60초가 지나야 가능합니다.');
    },
  });
}
