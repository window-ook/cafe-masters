'use server';

import { revalidateTag } from 'next/cache';
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { CollectionRowInsert } from "@/actions/supabase/collection";
import { ICoordinates, isWithinRadius } from '@/utils/shared/geo';
import { ARCHIVE_MATERIAL, DrawnMaterial, drawMaterial, isDailyDrawLimitError } from '@/utils/shared/material';

/** 저장한 카드. 재질이 null이면 미개봉 카드입니다 */
export interface ICreatedCollectionCafe {
    id: number;
    material: DrawnMaterial | null;
    /** false면 새 카드 대신 같은 장소에 담아 둔 미개봉 카드를 개봉한 것입니다. 카드 수는 그대로입니다 */
    isNew: boolean;
}

/**
 * 수집한 카페 추가
 * @description 사용자가 카페 반경 안에 있으면 재질이 즉시 확정되고,
 * 위치를 얻지 못했거나 반경 밖이면 material이 null로 저장되어 미개봉 상태가 됩니다.
 * 재질 추첨은 반드시 이 서버 액션에서만 이루어집니다.
 * 같은 장소에서 오늘(KST) 이미 추첨했다면 저장하지 않습니다.
 * 반경 안인데 같은 장소에 미개봉 카드가 있으면 새 카드를 만들지 않고 가장 오래된 미개봉 카드를 개봉합니다.
 * 원격으로 담아 둔 카페에 실제로 온 것이기 때문입니다.
 * @param cafe 카페 데이터
 * @param userCoords 사용자의 현재 좌표. 위치 권한이 없으면 생략합니다
 * @returns 저장하거나 개봉한 카드. 하루 1회 추첨 한도에 걸려 저장하지 않았으면 null
 */
export async function createCollectionCafe(
    cafe: CollectionRowInsert,
    userCoords?: ICoordinates | null,
): Promise<ICreatedCollectionCafe | null> {
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
        const { count, error: countError } = await supabase
            .from('collection')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user_id)
            .eq('place_provider', cafe.place_provider)
            .eq('place_id', cafe.place_id)
            .not('drawn_at', 'is', null)
            .neq('material', ARCHIVE_MATERIAL);

        /* 개수를 0으로 잘못 읽으면 라브라도라이트 확정 조건을 놓칩니다 */
        if (countError) throw new Error(`카드 수를 확인하지 못했습니다: ${countError.message}`);

        stackCount = count ?? 0;
    }

    const material = isAtCafe ? drawMaterial(cafe.name, stackCount) : null;
    const now = new Date().toISOString();

    if (isAtCafe) {
        const { data: unopened, error: unopenedError } = await supabase
            .from('collection')
            .select('id')
            .eq('user_id', user_id)
            .eq('place_provider', cafe.place_provider)
            .eq('place_id', cafe.place_id)
            .is('material', null)
            .order('created_at', { ascending: true })
            .limit(1);

        if (unopenedError) throw new Error(`미개봉 카드를 확인하지 못했습니다: ${unopenedError.message}`);

        if (unopened.length) {
            /* 개봉과 같은 조건부 쓰기입니다. 그사이 다른 요청이 먼저 개봉했다면 바뀐 행이 없습니다 */
            const { data: opened, error: openError } = await supabase
                .from('collection')
                .update({ material, drawn_at: now })
                .eq('id', unopened[0].id)
                .eq('user_id', user_id)
                .is('material', null)
                .select('id');

            if (isDailyDrawLimitError(openError)) return null;
            if (openError) throw new Error(`카드 개봉에 실패했습니다: ${openError.message}`);
            if (!opened?.length) throw new Error('이미 개봉된 카드입니다.');

            return { id: unopened[0].id, material, isNew: false };
        }
    }
    const { data, error } = await supabase
        .from('collection')
        .insert({
            ...cafe,
            user_id,
            material,
            drawn_at: isAtCafe ? now : null,
            created_at: now,
        })
        .select('id')
        .single();

    if (isDailyDrawLimitError(error)) return null;
    if (error) throw new Error(`카페 수집에 실패했습니다: ${error.message}`);

    revalidateTag('collection-counts', 'max');

    return { id: data.id, material, isNew: true };
}
