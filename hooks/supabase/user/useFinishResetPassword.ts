import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { getAuthErrorMessage } from '@/utils/shared/authError';

export function useFinishResetPassword() {
  const supabase = createBrowserSupabaseClient();

  const finishResetPassword = useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    },
    onSuccess: async () => {
      await supabase.auth.signOut();
    },
    onError: error => {
      const errorMessage = getAuthErrorMessage(error);
      alert(errorMessage);
    },
  });

  return { finishResetPassword: finishResetPassword.mutate };
}