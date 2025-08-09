'use server';

import { createServerSupabaseClient } from "utils/supabase/server";
import { ISupabaseCollectionCafe } from "@/types/supabase/collection";

/** 수집한 카페 목록 조회
 * @param user_id 유저 ID
 * @param offset 오프셋
 * @param limit 한 번에 가져올 카페 수
 * @returns 수집한 카페 목록과 다음 커서
 */
export async function getCollectionCafes(user_id: string, offset: number = 0, limit: number = 4)
    : Promise<{ data: ISupabaseCollectionCafe[]; nextCursor: number | null }> {
    if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('collection')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    const safeData = (data ?? []).map(item => ({
        ...item,
        extra_images: item.extra_images ? JSON.parse(item.extra_images) : undefined,
        categories: item.categories ? JSON.parse(item.categories) : undefined,
        opening_time: item.opening_time ?? undefined,
        phone_number: item.phone_number ?? undefined,
        eaten_menus: item.eaten_menus ?? undefined,
    }));

    const nextCursor = data && data.length === limit ? offset + limit : null;

    return { data: safeData, nextCursor };
}

/** 특정 수집 카페 조회 (메타데이터용)
 * @param cafeId 카페 ID
 * @returns 수집 카페 데이터
 */
export async function getCollectionCafeById(cafeId: number): Promise<ISupabaseCollectionCafe | null> {
    if (!cafeId) throw new Error('카페 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('collection')
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
        eaten_menus: data.eaten_menus ?? undefined,
    };
}
