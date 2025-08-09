'use server';

import { createServerSupabaseClient } from "utils/supabase/server";

/** 북마크한 카페 수 조회
 * @param user_id 유저 ID
 * @returns 북마크 카페 수
 */
export async function getBookmarkCounts(user_id: string): Promise<number> {
    if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('bookmark')
        .select('*', { count: 'exact' })
        .eq('user_id', user_id);

    if (error) throw new Error(error.message);

    return data?.length ?? 0;
}