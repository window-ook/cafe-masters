'use client';

import { useEffect, use } from 'react';
import { useCafeStore } from '@/stores';
import { IClientPage, UrlParams } from '@/types/shared/page';

/** 수집 카페 상세 페이지 클라이언트 컴포넌트
 * @param {IClientPage} props - 클라이언트 페이지 속성
 * @param {UrlParams} props.params - 파라미터
 * @returns {null} 렌더링 결과 없음, SideBar에서 카페 클릭 시 호출
 */
export default function CollectedDetailClient({ params }: IClientPage) {
  const resolvedParams: UrlParams = use(params);
  const { id } = resolvedParams;
  const numericId = parseFloat(id);

  const { collectedCafe, setCollectedCafeDetail } = useCafeStore();

  useEffect(() => {
    const targetCafe = collectedCafe.find(cafe => cafe.id === numericId);
    if (targetCafe) setCollectedCafeDetail([targetCafe]);
  }, [id, numericId, collectedCafe, setCollectedCafeDetail]);

  return null;
}