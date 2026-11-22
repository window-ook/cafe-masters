import 'server-only';

import { cache } from 'react';
import { createServerSupabaseClient } from '@/utils/supabase/server';

/**
 * 현재 요청의 Supabase 클라이언트와 로그인 사용자
 * @description 서버 컴포넌트 렌더 한 번 안에서는 결과를 공유합니다.
 * 레이아웃 prefetch가 조회 여러 개를 동시에 열어도 Supabase Auth 호출은 한 번입니다.
 * Route Handler에서는 공유되지 않고 호출마다 새로 만듭니다.
 * @returns 클라이언트와 사용자. 비로그인이면 user가 null입니다
 */
export const getAuthContext = cache(async () => {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    return { supabase, user };
});
