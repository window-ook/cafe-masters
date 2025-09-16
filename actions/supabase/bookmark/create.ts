'use server';

import { BookmarkRowInsert } from '.';
import { createServerSupabaseClient } from "@/utils/supabase/server";

/** 북마크한 카페 추가
 * @param cafe 카페 데이터 (user_id 제외)
 */
export async function createBookmarkCafe(cafe: Omit<BookmarkRowInsert, 'user_id'>): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');
    const user_id = user.data.user.id;
    if (!cafe) throw new Error('북마크 추가를 위한 카페 데이터가 유효하지 않습니다.');

    const insertData: BookmarkRowInsert = {
        ...cafe,
        user_id,
        created_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('bookmark')
        .insert(insertData as BookmarkRowInsert);

    if (error) throw new Error(`북마크 추가에 실패했습니다: ${error.message}`);

    return true;
}
