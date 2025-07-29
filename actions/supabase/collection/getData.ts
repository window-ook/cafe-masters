'use server';

import { createServerSupabaseClient } from "utils/supabase/server";
import { ISupabaseCollectedCafe } from "@/types/supabase/collection";

/** 수집한 카페 목록 조회
 * @param user_id 유저 ID
 * @param offset 오프셋
 * @param limit 한 번에 가져올 카페 수
 * @returns 수집한 카페 목록과 다음 커서
 */
export async function getCollectedCafes(user_id: string, offset: number = 0, limit: number = 4)
    : Promise<{ data: ISupabaseCollectedCafe[]; nextCursor: number | null }> {
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
