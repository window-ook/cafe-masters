'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

export async function getCurrentUserId(): Promise<string> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error('userId 조회 에러');
  return user.id;
}
