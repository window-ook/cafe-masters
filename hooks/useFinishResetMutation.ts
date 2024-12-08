import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useFinishResetMutation() {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw new Error(error.message);
    },
    onError: (error: Error) => {
      console.error(error);
      alert('새로운 비밀번호는 기존 비밀번호와 달라야합니다.');
    },
    onSuccess: async () => {
      await supabase.auth.signOut();
      alert('비밀번호를 재설정했습니다!');
      router.push('/resetpassword/complete');
    },
  });
}
