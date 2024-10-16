'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

/**
 * GET userID
 */
export async function getCurrentUserId() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error('유저 아이디 요청 에러');
  return user.id;
}
