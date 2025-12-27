'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';

export interface IUpdateUserProfileParams {
  user_id: string;
  nickname?: string;
  gender?: 'male' | 'female';
}

/**
 * 유저 프로필 업데이트
 * @returns 성공 여부
 */
export async function updateUserProfile(params: IUpdateUserProfileParams): Promise<boolean> {
  if (!params.user_id) throw new Error('유저 ID가 유효하지 않습니다.');
  if (!params.nickname && !params.gender) throw new Error('업데이트할 정보가 없습니다.');

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== params.user_id) throw new Error('인증이 필요합니다.');

  if (params.nickname) {
    const { data: existing } = await supabase
      .from('user')
      .select('user_id')
      .eq('nickname', params.nickname)
      .neq('user_id', params.user_id)
      .maybeSingle();

    if (existing) throw new Error('이미 사용 중인 닉네임입니다.');
  }

  const updateData: { nickname?: string; gender?: 'male' | 'female' } = {};
  if (params.nickname) updateData.nickname = params.nickname;
  if (params.gender) updateData.gender = params.gender;

  const { error } = await supabase
    .from('user')
    .update(updateData)
    .eq('user_id', params.user_id);

  if (error) throw new Error(`프로필 업데이트 실패: ${error.message}`);

  return true;
}
