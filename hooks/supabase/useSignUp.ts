import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useSignUp() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const signUp = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/confirm`,
        },
      });

      if (error) throw new Error(error.message);
    },

    onSuccess: async () => {
      await supabase.auth.refreshSession();
      router.replace('/main');
    },

    onError: error => console.error(error),
  });

  return { signUp: signUp.mutate, signUpPending: signUp.isPending };
}
