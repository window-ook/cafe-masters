'use server';

import { BookmarkRowInsert } from '.';
import { createServerSupabaseClient } from "utils/supabase/server";


/** 북마크한 카페 추가
 * @param cafe 카페 데이터
 */
export async function createBookmarkCafe(cafe: BookmarkRowInsert): Promise<boolean> {
    if (!cafe) throw new Error('북마크 추가를 위한 카페 데이터가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from('bookmark').insert({
        ...cafe,
        created_at: new Date().toISOString(),
    });

    if (error) throw new Error(error.message);

    return true;
}
