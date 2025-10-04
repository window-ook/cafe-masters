'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { getAuthErrorMessage } from '@/utils/shared/authError';
import { toast } from 'react-toastify';

export function useSignUp() {
  const supabase = createBrowserSupabaseClient();

  const signUp = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/confirm`,
          },
        });

        return { success: !error, error };
      } catch (error) {
        return { success: false, error };
      }
    },
  });

  const signUpWithCallback = (
    params: { email: string; password: string },
    callbacks?: {
      onSuccess?: () => void;
      onError?: (error: any) => void;
    }
  ) => {
    signUp.mutate(params, {
      onSuccess: (result) => {
        if (result.success) {
          callbacks?.onSuccess?.();
        } else {
          const errorMessage = getAuthErrorMessage(result.error);
          toast.error(errorMessage);
          callbacks?.onError?.(result.error);
        }
      },
      onError: (error) => {
        const errorMessage = getAuthErrorMessage(error);
        toast.error(errorMessage);
        callbacks?.onError?.(error);
      }
    });
  };

  return {
    signUp: signUpWithCallback,
    signUpPending: signUp.isPending
  };
}