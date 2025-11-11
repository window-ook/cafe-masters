'use client';

import { createBrowserSupabaseClient } from 'utils/supabase/client';

export const signInWithGoogle = async () => {
    const supabase = createBrowserSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
    });

    if (data) return;
    if (error) console.error(error.message);
};