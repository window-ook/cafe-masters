'use client';

import { toast } from 'react-toastify';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export const signInWithKakao = async () => {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: process.env.NEXT_PUBLIC_API_REQUEST_URI
        ? `https://${process.env.NEXT_PUBLIC_API_REQUEST_URI}/auth/callback`
        : 'http://localhost:3000/auth/callback',
    },
  });

  if (error) toast.error(error.message);

  if (data) console.log(data);
};
