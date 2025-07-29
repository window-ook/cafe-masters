'use server';

import { createServerSupabaseClient } from "utils/supabase/server";
import { CollectedRowUpdate } from ".";

/** 수집한 카페 내용 수정
 * @param cafe 수정된 카페 데이터
 * @param id 카페 ID
 * @param user_id 유저 ID
 */
export async function updateCollectedCafe(cafe: CollectedRowUpdate, id: number, user_id: string): Promise<boolean> {
    if (!cafe) throw new Error('수집 카페 수정을 위한 카페 데이터가 유효하지 않습니다.');
    if (!id || id === 0) throw new Error('수집 카페 수정을 위한 카페 ID가 유효하지 않습니다.');
    if (!user_id) throw new Error('유저 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
        .from('collection')
        .update({
            ...cafe,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user_id);

    if (error) throw new Error(error.message);

    return true;
}
