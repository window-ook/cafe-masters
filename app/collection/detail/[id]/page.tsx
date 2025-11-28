import { Metadata } from 'next';
import { getCollectionCafeById } from '@/actions/supabase/collection';
import { IPageParams } from '@/types/shared/page';

export async function generateMetadata({ params }: IPageParams): Promise<Metadata> {
  const { id } = await params;
  const cafeId = Number(id);
  const cafe = await getCollectionCafeById(cafeId);

  return {
    title: `${cafe?.name} 상세 정보 : Cafe Masters`,
    description: `수집한 카페 '${cafe?.name}'의 상세 정보를 확인해보세요.`,
    alternates: {
      canonical: `https://www.cafe-masters.com/collection/detail/${id}`
    },
  };
}

export default function CollectionDetailPage() {
  return null;
}