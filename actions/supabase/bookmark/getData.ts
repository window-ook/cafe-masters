'use server';

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ISupabaseBookmarkCafe } from "@/types/supabase/bookmark";

/** 
 * 모든 북마크 카페 조회
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

    return { data: data ?? [] };
}

/**
 * 특정 북마크 카페 조회 (메타데이터용)
 * @param cafeId 카페 ID
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

    return data;
}
