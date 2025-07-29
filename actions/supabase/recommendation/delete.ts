'use server';

import { createServerSupabaseClient } from "utils/supabase/server";

/** 추천 카페 삭제
 * @param id 카페 ID
 */
export async function deleteRecommendedCafe(id: number): Promise<boolean> {
    if (!id) throw new Error('추천 카페 삭제를 위한 카페 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from('recommendation')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    return true;
}