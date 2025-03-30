'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';
import { PostgrestError } from '@supabase/supabase-js';

function handleError(error: PostgrestError): void {
  console.error(error);
  throw new Error(error.message);
}

export async function getCurrentUserId(): Promise<string> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error('userId가 존재하지 않음');
  return user.id;
}

export async function getAdminUser(userId: string): Promise<boolean> {
  if (!userId || userId === 'no-user') throw new Error('유효하지 않은 유저 ID');

  const trimmedUserId = userId.trim();

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('user')
    .select('userId, admin')
    .eq('userId', trimmedUserId)
    .maybeSingle();

  if (!data) throw new Error('어드민 유저가 아닙니다.');
  if (error) handleError(error);

  return data.admin === true;
}
