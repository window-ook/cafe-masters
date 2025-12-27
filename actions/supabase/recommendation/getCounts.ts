'use server';

import { createServerSupabaseClient } from "utils/supabase/server";

/**
 * 추천 카페 수 조회
 */
export async function getRecommendationCounts(): Promise<number> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('recommendation')
        .select('*', { count: 'exact' });

    if (error) throw new Error(error.message);

    return data?.length ?? 0;
}