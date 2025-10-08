'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

/** 관리자 여부 조회
 * @returns 관리자 여부
 */
export async function getIsAdmin(): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    // 인증 검증
    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');
    const user_id = user.data.user.id;
    if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

    const { data, error } = await supabase
        .from('admin')
        .select('user_id, admin')
        .eq('user_id', user_id)
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data?.admin === true;
}