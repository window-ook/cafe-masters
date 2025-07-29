'use server';

import { createServerSupabaseClient } from "utils/supabase/server";

/** 추천 카페 수 조회
 * @param user_id 유저 ID
 * @returns 추천 카페 수
 */
export async function getRecommendedCafesCounts(): Promise<number> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('recommendation')
        .select('*', { count: 'exact' });

    if (error) throw new Error(error.message);

    return data?.length ?? 0;
}