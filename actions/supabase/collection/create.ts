'use server';

import { revalidateTag } from 'next/cache';
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { CollectionRowInsert } from "@/actions/supabase/collection";
import { ICoordinates, isWithinRadius } from '@/utils/shared/geo';
import { drawMaterial } from '@/utils/shared/material';

/**
 * 수집한 카페 추가
 * @description 사용자가 카페 반경 안에 있으면 재질이 즉시 확정되고,
 * 위치를 얻지 못했거나 반경 밖이면 material이 null로 저장되어 미개봉 상태가 됩니다.
 * 재질 추첨은 반드시 이 서버 액션에서만 이루어집니다.
 * @param cafe 카페 데이터
 * @param userCoords 사용자의 현재 좌표. 위치 권한이 없으면 생략합니다
 */
export async function createCollectionCafe(
    cafe: CollectionRowInsert,
    userCoords?: ICoordinates | null,
): Promise<boolean> {
    if (!cafe) throw new Error('수집 카페 추가를 위한 카페 데이터가 유효하지 않습니다.');

    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

    const isAtCafe =
        !!userCoords &&
        isWithinRadius(userCoords, { lat: cafe.coordY, lng: cafe.coordX });

    const user_id = user.data.user.id;

    /* 같은 카페 스택 두께는 라브라도라이트 확정 조건이므로 위치가 인증됐을 때만 조회합니다 */
    let stackCount = 0;

    if (isAtCafe && cafe.name) {
        const { count } = await supabase
            .from('collection')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user_id)
            .eq('name', cafe.name);

        stackCount = count ?? 0;
    }

    const { error } = await supabase.from('collection').insert({
        ...cafe,
        user_id,
        material: isAtCafe ? drawMaterial(cafe.name, stackCount) : null,
        created_at: new Date().toISOString(),
    });

    if (error) throw new Error(`카페 수집에 실패했습니다: ${error.message}`);

    revalidateTag('collection-counts', 'max');

    return true;
}