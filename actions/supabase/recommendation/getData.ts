'use server';

import { createServerSupabaseClient } from "utils/supabase/server";
import { ISupabaseRecommendationCafe } from "@/types/supabase/recommendation";

/** 추천 카페 목록 조회
 * @returns 추천 카페 목록
 */
export async function getRecommendationCafes(): Promise<{ data: ISupabaseRecommendationCafe[] }> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('recommendation')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) throw new Error(`추천 카페 목록 조회에 실패했습니다: ${error.message}`);

    const safeData = (data ?? []).map(item => {

        return {
            ...item,
            extra_images: item.extra_images ? JSON.parse(item.extra_images) : undefined,
            categories: item.categories ? JSON.parse(item.categories) : undefined,
            opening_time: item.opening_time ?? undefined,
            phone_number: item.phone_number ?? undefined,
            menus: item.menus ?? undefined,
        };
    });

    return { data: safeData };
}
