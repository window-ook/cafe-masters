import { Metadata } from 'next';
import { getBookmarkCafeById } from '@/actions/supabase/bookmark';
import { IPageParams } from '@/types/shared/page';
import BookmarkDetailClient from '@/components/bookmark/detail/BookmarkDetailClient';

export async function generateMetadata({ params }: IPageParams): Promise<Metadata> {
  const { id } = await params;
  const cafeId = Number(id);
  const cafe = await getBookmarkCafeById(cafeId);

  return {
    title: `${cafe?.name} 상세 정보 : CAFE MASTERS`,
    description: `북마크한 카페 '${cafe?.name}'의 상세 정보를 확인해보세요.`,
    alternates: {
      canonical: `https://www.cafe-masters.com/bookmark/detail/${id}`
    },
  };
}

export default function BookmarkDetailPage({ params }: IPageParams) {
  return <BookmarkDetailClient params={params} />;
}