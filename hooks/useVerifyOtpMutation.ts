import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export default function useVerifyOtpMutation() {
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

    onError: (error: Error) => console.error(error),
  });
}
