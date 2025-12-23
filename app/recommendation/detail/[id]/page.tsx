import { Metadata } from 'next';
import { getRecommendationCafeById } from '@/actions/supabase/recommendation';
import { IPageParams } from '@/types/shared/page';

export async function generateMetadata({ params }: IPageParams): Promise<Metadata> {
  const { id } = await params;
  const cafeId = Number(id);
  const cafe = await getRecommendationCafeById(cafeId);

  return {
    title: `${cafe?.name} 상세 정보 : CAFE MASTERS`,
    description: 'CAFE MASTERS에서 엄선한 추천 카페의 상세 정보를 확인해보세요. 위치, 메뉴, 영업시간 등 다양한 정보를 제공합니다.',
    alternates: {
      canonical: `https://www.cafe-masters.com/recommendation/detail/${id}`
    },
  };
}

export default function RecommendationDetailPage() {
  return null;
}