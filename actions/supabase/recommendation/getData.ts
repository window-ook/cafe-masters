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

/** 특정 수집 카페 조회 (메타데이터용)
 * @param cafeId 카페 ID
 * @returns 수집 카페 데이터
 */
export async function getRecommendationCafeById(cafeId: number): Promise<ISupabaseRecommendationCafe | null> {
    if (!cafeId) throw new Error('카페 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('recommendation')
        .select('*')
        .eq('id', cafeId)
        .single();

    if (error || !data) return null;

    return {
        ...data,
        extra_images: data.extra_images ? JSON.parse(data.extra_images) : undefined,
        categories: data.categories ? JSON.parse(data.categories) : undefined,
        opening_time: data.opening_time ?? undefined,
        phone_number: data.phone_number ?? undefined,
        menus: data.menus ?? undefined,
    };
}