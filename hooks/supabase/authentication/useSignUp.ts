'use client';

import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { getAuthErrorMessage } from '@/utils/shared/authError';
import { toast } from 'react-toastify';

export function useSignUp() {
  const supabase = createBrowserSupabaseClient();

  const signUp = useMutation({
    mutationFn: async ({ email, password, nickname, gender }: { email: string; password: string; nickname: string; gender: 'male' | 'female' }) => {
      try {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/confirm`,
          },
        });

        if (error) return { success: false, error };

        // Database Trigger가 user 레코드 생성하지만 nickname, gender는 NULL
        // 즉시 업데이트
        if (data.user) {
          await supabase
            .from('user')
            .update({ nickname, gender })
            .eq('user_id', data.user.id);
        }

        return { success: true, error: null };
      } catch (error) {
        return { success: false, error };
      }
    },
  });

  const signUpWithCallback = (
    params: { email: string; password: string; nickname: string; gender: 'male' | 'female' },
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