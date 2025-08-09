'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { getAuthErrorMessage } from '@/utils/shared/authErrorHandler';

/** Supabase 비밀번호 재설정 요청 훅
 * @description 이메일로 비밀번호 재설정 링크를 전송합니다
 * @returns { requestReset: (email: string) => void, isPending, error }
 */
export function useRequestResetPassword() {
  const supabase = createBrowserSupabaseClient();

  const requestResetPassword = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword`,
      });
      if (error) throw error;
      return '이메일의 보관함을 확인해주세요.';
    },

    onError: error => {
      const errorMessage = getAuthErrorMessage(error);
      alert(errorMessage);
    },
  });

  return { requestResetPassword: requestResetPassword.mutate };
}