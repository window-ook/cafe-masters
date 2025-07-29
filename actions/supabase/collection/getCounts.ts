'use server';

import { createServerSupabaseClient } from "utils/supabase/server";

/** 수집한 카페 수 조회
 * @param user_id 유저 ID
 * @returns 수집 카페 수
 */
export async function getCollectedCafesCounts(user_id: string): Promise<number> {
    if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('collection')
        .select('*', { count: 'exact' })
        .eq('user_id', user_id);

    if (error) throw new Error(error.message);

    return data?.length ?? 0;
}
