'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

/** 관리자 여부 조회
 * @param user_id 유저 ID
 * @returns 관리자 여부
 */
export async function getIsAdmin(user_id: string): Promise<boolean> {
    if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

    const trimmedUserId = user_id.trim();

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('user')
        .select('user_id, admin')
        .eq('user_id', trimmedUserId)
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data?.admin === true;
}