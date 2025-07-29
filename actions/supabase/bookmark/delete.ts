'use server';

import { createServerSupabaseClient } from "utils/supabase/server";

/** 북마크한 카페 삭제 */
export async function deleteBookmarkedCafe(id: number, user_id: string,): Promise<boolean> {
    if (!id) throw new Error('북마크 삭제를 위한 카페 ID가 유효하지 않습니다.');
    if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
        .from('bookmark')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

    if (error) throw new Error(error.message);

    return true;
}
