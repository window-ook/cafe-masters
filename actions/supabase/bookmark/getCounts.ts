'use server';

import { createServerSupabaseClient } from "utils/supabase/server";

/** 북마크한 카페 수 조회
 * @returns 북마크 카페 수
 */
export async function getBookmarkCounts(): Promise<number> {
    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    // 인증 검증
    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');
    const user_id = user.data.user.id;

    // 북마크 카페 수 조회
    const { data, error } = await supabase
        .from('bookmark')
        .select('*', { count: 'exact' })
        .eq('user_id', user_id);

    if (error) throw new Error(error.message);

    return data?.length ?? 0;
}