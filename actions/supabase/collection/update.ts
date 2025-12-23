'use server';

import { createServerSupabaseClient } from "utils/supabase/server";
import { CollectionRowUpdate } from ".";

/**
 * 수집한 카페 내용 수정
 * @param cafe 수정된 카페 데이터
 * @param id 카페 ID
 */
export async function updateCollectionCafe(cafe: CollectionRowUpdate, id: number): Promise<boolean> {
    if (!cafe) throw new Error('수집 카페 수정을 위한 카페 데이터가 유효하지 않습니다.');
    if (!id || id === 0) throw new Error('수집 카페 수정을 위한 카페 ID가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

    const user_id = user.data.user.id;
    const { error } = await supabase
        .from('collection')
        .update({
            ...cafe,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user_id);

    if (error) throw new Error(`수집 카페 수정에 실패했습니다: ${error.message}`);

    return true;
}
