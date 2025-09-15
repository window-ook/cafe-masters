import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { getAuthErrorMessage } from '@/utils/shared/authError';

export function useVerifyOtpCode() {
  const supabase = createBrowserSupabaseClient();

  const verifyOtpCode = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const { error } = await supabase.auth.verifyOtp({
        type: 'signup',
        email,
        token: otp,
      });

      if (error) throw error;
    },

    onError: error => {
      const errorMessage = getAuthErrorMessage(error);
      alert(errorMessage);
    },
  });

  return { verifyOtpCode: verifyOtpCode.mutate, verifyOtpPending: verifyOtpCode.isPending };
}
