import 'server-only';

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ISupabaseRecommendationCafe } from "@/types/supabase/recommendation";

/**
 * 추천 카페 목록 조회
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
            categories: item.categories ? JSON.parse(item.categories) : undefined,
        };
    });

    return { data: safeData };
}
