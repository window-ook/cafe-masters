'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from "utils/supabase/server";
import { RecommendationRowInsert } from ".";
import { Database } from '@/types_db';

/**
 * 추천 카페 추가 (관리자 전용)
 * @param cafe 카페 데이터
 */
export async function createRecommendationCafe(cafe: RecommendationRowInsert): Promise<boolean> {
    if (!cafe) throw new Error('추천 카페 추가를 위한 카페 데이터가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

    const { data: userData, error: userError } = await supabase
        .from('user')
        .select('admin')
        .eq('user_id', user.data.user.id)
        .single();

    if (userError || !userData) throw new Error(`사용자 정보를 가져올 수 없습니다: ${userError?.message}`);
    if (!userData.admin) throw new Error(`관리자 권한이 필요합니다. (현재 admin: ${userData.admin})`);

    // Service Role 키로 직접 클라이언트 생성 (RLS 우회)
    const supabaseAdmin = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_SUPABASE_SERVICE_ROLE!
    );

    const { error } = await supabaseAdmin.from('recommendation').insert({
        ...cafe,
        created_at: new Date().toISOString(),
    });

    if (error) throw new Error(error.message);
    return true;
}
