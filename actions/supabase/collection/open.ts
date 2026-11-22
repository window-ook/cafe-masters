'use server';

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ICoordinates, isWithinRadius } from '@/utils/shared/geo';
import { ARCHIVE_MATERIAL, DrawnMaterial, drawMaterial, isDailyDrawLimitError } from '@/utils/shared/material';

/**
 * 미개봉 카드를 개봉해 재질을 확정
 * @description 위치를 얻지 못한 채 수집된 카드(material이 null)를 해당 카페 반경 안에서 개봉합니다.
 * 이미 재질이 있는 카드는 다시 뽑을 수 없으므로 리롤 경로가 생기지 않습니다.
 * 같은 장소에서 오늘(KST) 이미 추첨했다면 미개봉 상태를 유지합니다.
 * 미개봉일 때만 쓰도록 조건을 걸어, 동시에 두 번 개봉해도 재질은 한 번만 확정됩니다.
 * @param id 카드 ID
 * @param userCoords 사용자의 현재 좌표
 * @returns 확정된 재질. 하루 1회 추첨 한도에 걸렸으면 null
 */
export async function openCollectionCafe(
    id: number,
    userCoords: ICoordinates,
): Promise<DrawnMaterial | null> {
    if (!id) throw new Error('개봉할 카드 ID가 유효하지 않습니다.');
    if (!userCoords) throw new Error('현재 위치를 확인할 수 없습니다.');

    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

    const user_id = user.data.user.id;
    const { data: card, error: selectError } = await supabase
        .from('collection')
        .select('name, material, coordX, coordY, place_provider, place_id')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

    if (selectError) throw new Error(`카드를 불러오지 못했습니다: ${selectError.message}`);
    if (!card) throw new Error('카드를 찾을 수 없습니다.');
    if (card.material) throw new Error('이미 개봉된 카드입니다.');

    if (!isWithinRadius(userCoords, { lat: card.coordY, lng: card.coordX }))
        throw new Error('카페 근처에서만 개봉할 수 있습니다.');

    /* 개봉하려는 카드 자신은 스택에서 제외합니다. 수집 시점과 같은 기준(추첨된 카드만)이어야 합니다 */
    const { count, error: countError } = await supabase
        .from('collection')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .eq('place_provider', card.place_provider)
        .eq('place_id', card.place_id)
        .not('drawn_at', 'is', null)
        .neq('material', ARCHIVE_MATERIAL)
        .neq('id', id);

    /* 개수를 0으로 잘못 읽으면 라브라도라이트 확정 조건을 놓칩니다 */
    if (countError) throw new Error(`카드 수를 확인하지 못했습니다: ${countError.message}`);

    const material = drawMaterial(card.name, count ?? 0);
    const { data: updated, error } = await supabase
        .from('collection')
        .update({ material, drawn_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user_id)
        .is('material', null)
        .select('id');

    if (isDailyDrawLimitError(error)) return null;
    if (error) throw new Error(`카드 개봉에 실패했습니다: ${error.message}`);

    /* 그사이 다른 요청이 먼저 개봉했다면 바뀐 행이 없습니다. 이 요청의 후보 재질은 버립니다 */
    if (!updated?.length) throw new Error('이미 개봉된 카드입니다.');

    return material;
}
