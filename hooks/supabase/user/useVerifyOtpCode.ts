'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { getAuthErrorMessage } from '@/utils/shared/authError';

export function useVerifyOtpCode() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const verifyOtpCode = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const { error } = await supabase.auth.verifyOtp({
        type: 'signup',
        email,
        token: otp,
      });

      if (error) throw error;
    },

    onSuccess: async () => {
      sessionStorage.removeItem('signup_email');
      router.replace('/main');
    },

    onError: error => {
      const errorMessage = getAuthErrorMessage(error);
      alert(errorMessage);
    },
  });

  return { verifyOtpCode: verifyOtpCode.mutate, verifyOtpPending: verifyOtpCode.isPending };
}