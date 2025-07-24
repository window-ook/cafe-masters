import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useVerifyOtpCode() {
  const supabase = createBrowserSupabaseClient();

  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const { error } = await supabase.auth.verifyOtp({
        type: 'signup',
        email,
        token: otp,
      });

      if (error) throw new Error(error.message);
    },

    onError: error => console.error(error),
  });
}
