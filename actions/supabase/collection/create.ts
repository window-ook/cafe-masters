'use server';

import { createServerSupabaseClient } from "utils/supabase/server";
import { CollectionRowInsert } from ".";

/** 수집한 카페 추가
 * @param cafe 카페 데이터
 */
export async function createCollectionCafe(cafe: CollectionRowInsert): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    // 인증 검증
    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');
    const user_id = user.data.user.id;

    if (!cafe) throw new Error('수집 카페 추가를 위한 카페 데이터가 유효하지 않습니다.');

    // 수집 카페 추가
    const { error } = await supabase.from('collection').insert({
        ...cafe,
        user_id,
        created_at: new Date().toISOString(),
    });

    if (error) throw new Error(`카페 수집에 실패했습니다: ${error.message}`);

    return true;
}