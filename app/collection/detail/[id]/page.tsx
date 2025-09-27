import { Metadata } from 'next';
import { getCollectionCafeById } from '@/actions/supabase/collection';
import { IPageParams } from '@/types/shared/page';
import { CONSOLE_ERROR } from '@/utils/constants/messages';

export async function generateMetadata({ params }: IPageParams): Promise<Metadata> {
  const { id } = await params;
  const cafeId = Number(id);

  try {
    const cafe = await getCollectionCafeById(cafeId);

    if (cafe) {
      return {
        title: `${cafe.name} 상세 정보 : Cafe Masters`,
        description: `수집한 카페 '${cafe.name}'의 상세 정보를 확인해보세요.`,
      };
    }
  } catch (error) {
    console.error(CONSOLE_ERROR.CREATE_METADATA, error);
  }

  return {
    title: '카페 상세 정보 : Cafe Masters',
    description: '수집한 카페의 상세 정보를 확인해보세요.',
  };
}

export default function CollectionDetailPage() {
  return null;
}