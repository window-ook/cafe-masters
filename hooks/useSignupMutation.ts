import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export function useSignupMutation() {
  const supabase = createBrowserSupabaseClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_API_REQUEST_URI}/signup/confirm`,
        },
      });

      if (error) throw new Error(error.message);
    },

    onError: (error: Error) => console.error(error),
  });
}
