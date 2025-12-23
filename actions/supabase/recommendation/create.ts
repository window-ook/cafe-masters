'use server';

import { createServerSupabaseClient } from "utils/supabase/server";
import { RecommendationRowInsert } from ".";

/**
 * 추천 카페 추가
 * @param cafe 카페 데이터
 */
export async function createRecommendationCafe(cafe: RecommendationRowInsert): Promise<boolean> {
    if (!cafe) throw new Error('추천 카페 추가를 위한 카페 데이터가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from('recommendation').insert({
        ...cafe,
        created_at: new Date().toISOString(),
    });

    if (error) throw new Error(error.message);
    return true;
}
