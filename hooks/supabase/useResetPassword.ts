'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';

/** Supabase 비밀번호 재설정 요청 훅
 * @description 이메일로 비밀번호 재설정 링크를 전송합니다
 * @returns { requestReset: (email: string) => void, isPending, error }
 */
export function useResetPassword() {
  const supabase = createBrowserSupabaseClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword`,
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
