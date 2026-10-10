'use server';

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ICoordinates, isWithinRadius } from '@/utils/shared/geo';
import { DrawnMaterial, drawMaterial } from '@/utils/shared/material';

/**
 * 미개봉 카드를 개봉해 재질을 확정
 * @description 위치를 얻지 못한 채 수집된 카드(material이 null)를 해당 카페 반경 안에서 개봉합니다.
 * 이미 재질이 있는 카드는 다시 뽑을 수 없으므로 리롤 경로가 생기지 않습니다.
 * @param id 카드 ID
 * @param userCoords 사용자의 현재 좌표
 */
export async function openCollectionCafe(
    id: number,
    userCoords: ICoordinates,
): Promise<DrawnMaterial> {
    if (!id) throw new Error('개봉할 카드 ID가 유효하지 않습니다.');
    if (!userCoords) throw new Error('현재 위치를 확인할 수 없습니다.');

    const supabase = await createServerSupabaseClient();
    const user = await supabase.auth.getUser();

    if (!user?.data?.user) throw new Error('로그인이 필요합니다.');

    const user_id = user.data.user.id;
    const { data: card, error: selectError } = await supabase
        .from('collection')
        .select('name, material, coordX, coordY')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

    if (selectError) throw new Error(`카드를 불러오지 못했습니다: ${selectError.message}`);
    if (!card) throw new Error('카드를 찾을 수 없습니다.');
    if (card.material) throw new Error('이미 개봉된 카드입니다.');

    if (!isWithinRadius(userCoords, { lat: card.coordY, lng: card.coordX }))
        throw new Error('카페 근처에서만 개봉할 수 있습니다.');

    /* 개봉하려는 카드 자신은 스택에서 제외합니다. 수집 시점과 같은 기준이어야 합니다 */
    const { count } = await supabase
        .from('collection')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .eq('name', card.name)
        .neq('id', id);

    const material = drawMaterial(card.name, count ?? 0);
    const { error } = await supabase
        .from('collection')
        .update({ material })
        .eq('id', id)
        .eq('user_id', user_id);

    if (error) throw new Error(`카드 개봉에 실패했습니다: ${error.message}`);

    return material;
}
