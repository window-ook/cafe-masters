import { Metadata } from 'next';

/**
 * 추천 카페 상세 메타데이터
 * @description 카카오 장소 정보를 외부에 내보내지 않도록 카페 이름을 싣지 않고 검색엔진 색인에서 뺍니다
 */
export const metadata: Metadata = {
  title: '추천 카페 상세 : CAFE MASTERS',
  description: 'CAFE MASTERS에서 엄선한 추천 카페를 확인해보세요.',
  robots: { index: false },
};

export default function RecommendationDetailPage() {
  return null;
}
