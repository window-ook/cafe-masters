'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

export async function getCurrentUserId(): Promise<string> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error('유저 ID가 존재하지 않음');
  return user.id;
}
