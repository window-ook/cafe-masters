'use server';

import { createServerSupabaseClient } from "utils/supabase/server";
import { ISupabaseBookmarkCafe } from "@/types/supabase/bookmark";

/** 
 * 모든 북마크 카페 조회
 * @returns 북마크 카페 목록
 */
export async function getBookmarkCafes(): Promise<{ data: ISupabaseBookmarkCafe[] }> {
    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

    const user_id = user.data.user.id;
    const { data, error } = await supabase
        .from('bookmark')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    const safeData = (data ?? []).map(item => ({
        ...item,
        extra_images: item.extra_images ? JSON.parse(item.extra_images) : undefined,
        opening_time: item.opening_time ?? undefined,
        phone_number: item.phone_number ?? undefined,
        menus: item.menus ?? undefined,
    }));

    return { data: safeData };
}

/**
 * 특정 북마크 카페 조회 (메타데이터용)
 * @param cafeId 카페 ID
 * @returns 북마크 카페 데이터
 */
export async function getBookmarkCafeById(cafeId: number): Promise<ISupabaseBookmarkCafe | null> {
    if (!cafeId) throw new Error('카페 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

    const user_id = user.data.user.id;
    const { data, error } = await supabase
        .from('bookmark')
        .select('*')
        .eq('id', cafeId)
        .eq('user_id', user_id)
        .single();

    if (error || !data) return null;

    return {
        ...data,
        extra_images: data.extra_images ? JSON.parse(data.extra_images) : undefined,
        opening_time: data.opening_time ?? undefined,
        phone_number: data.phone_number ?? undefined,
        menus: data.menus ?? undefined,
    };
}
