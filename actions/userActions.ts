'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

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
  if (!userId || userId.trim() === '' || userId === 'no-user') {
    console.error('유효하지 않은 유저 ID:', userId);
    return false;
  }

  const supabase = await createServerSupabaseClient();

  const trimmedUserId = userId.trim();

  const { data, error } = await supabase
    .from('user')
    .select('userId, admin')
    .eq('userId', trimmedUserId)
    .maybeSingle();

  if (error) {
    console.error('Supabase 에러:', error.message);
    return false;
  }

  if (!data) {
    console.warn('admin이 아닌 사용자입니다.');
    return false;
  }

  return data.admin === true;
}
