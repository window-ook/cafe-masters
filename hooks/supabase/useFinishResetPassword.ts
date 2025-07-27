import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useFinishResetPassword() {
  const supabase = createBrowserSupabaseClient();

  const finishResetPassword = useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      await supabase.auth.signOut();
    },
    onError: error => {
      console.error(error);
      alert('새로운 비밀번호는 기존 비밀번호와 달라야합니다.');
    },
  });

  return { finishResetPassword: finishResetPassword.mutate };
}