'use client';

import { use } from 'react';
import { IClientPage, UrlParams } from '@/types/shared/page';
import useCafeDetailState from '@/hooks/shared/useCafeDetailState';

/** 추천 카페 상세 페이지 클라이언트 컴포넌트
 * @param {IClientPage} props - 클라이언트 페이지 속성
 * @param {UrlParams} props.params - 파라미터
 * @returns {null} 렌더링 결과 없음, SideBar에서 카페 클릭 시 호출
 */
export default function RecommendedDetailClient({ params }: IClientPage) {
  const resolvedParams: UrlParams = use(params);
  const { id } = resolvedParams;

  useCafeDetailState(id, 'recommended');

  return null;
}
