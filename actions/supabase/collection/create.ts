'use server';

import { createServerSupabaseClient } from "utils/supabase/server";
import { CollectedRowInsert } from ".";

/** 수집한 카페 추가
 * @param cafe 카페 데이터
 */
export async function createCollectedCafe(cafe: CollectedRowInsert): Promise<boolean> {
    // 1. 인증 검증 (필수)
    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();
    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');
    const user_id = user.data.user.id;

    if (!cafe) throw new Error('수집 카페 추가를 위한 카페 데이터가 유효하지 않습니다.');

    // 2. 카페 데이터 삽입
    const { error } = await supabase.from('collection').insert({
        ...cafe,
        user_id, // 인증된 유저 ID 사용
        created_at: new Date().toISOString(),
    });

    if (error) throw new Error(`카페 수집에 실패했습니다: ${error.message}`);

    return true;
}