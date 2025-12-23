'use server';

import { createServerSupabaseClient } from "utils/supabase/server";

/** 
 * 북마크한 카페 삭제
 * @param id 북마크 ID
 */
export async function deleteBookmarkCafe(id: number): Promise<boolean> {
    if (!id) throw new Error('북마크 삭제를 위한 카페 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

    const user_id = user.data.user.id;
    const { error } = await supabase.from('bookmark').delete()
        .eq('id', id)
        .eq('user_id', user_id);

    if (error) throw new Error(`북마크 삭제에 실패했습니다: ${error.message}`);

    return true;
}
