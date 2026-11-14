'use server';

import { revalidateTag } from 'next/cache';
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { CollectionRowInsert } from "@/actions/supabase/collection";
import { ICoordinates, isWithinRadius } from '@/utils/shared/geo';
import { ARCHIVE_MATERIAL, drawMaterial, isDailyDrawLimitError } from '@/utils/shared/material';

/**
 * 수집한 카페 추가
 * @description 사용자가 카페 반경 안에 있으면 재질이 즉시 확정되고,
 * 위치를 얻지 못했거나 반경 밖이면 material이 null로 저장되어 미개봉 상태가 됩니다.
 * 재질 추첨은 반드시 이 서버 액션에서만 이루어집니다.
 * 같은 장소에서 오늘(KST) 이미 추첨했다면 저장하지 않습니다.
 * @param cafe 카페 데이터
 * @param userCoords 사용자의 현재 좌표. 위치 권한이 없으면 생략합니다
 * @returns 저장했으면 true, 하루 1회 추첨 한도에 걸려 저장하지 않았으면 false
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

    /* 같은 장소 스택 두께는 라브라도라이트 확정 조건이므로 위치가 인증됐을 때만 조회합니다.
       미개봉을 세면 원격으로 쌓아 두고 한 번 방문해 확정할 수 있으므로 추첨된 카드만 셉니다 */
    let stackCount = 0;

    if (isAtCafe) {
        const { count } = await supabase
            .from('collection')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user_id)
            .eq('place_provider', cafe.place_provider)
            .eq('place_id', cafe.place_id)
            .not('drawn_at', 'is', null)
            .neq('material', ARCHIVE_MATERIAL);

        stackCount = count ?? 0;
    }

    const now = new Date().toISOString();
    const { error } = await supabase.from('collection').insert({
        ...cafe,
        user_id,
        material: isAtCafe ? drawMaterial(cafe.name, stackCount) : null,
        drawn_at: isAtCafe ? now : null,
        created_at: now,
    });

    if (isDailyDrawLimitError(error)) return false;
    if (error) throw new Error(`카페 수집에 실패했습니다: ${error.message}`);

    revalidateTag('collection-counts', 'max');

    return true;
}
