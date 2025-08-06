import { Metadata } from 'next';
import BookmarkDetailClient from '@/components/bookmark/detail/BookmarkDetailClient';

export const metadata: Metadata = {
  title: `카페 상세 정보 : Cafe Masters`,
  description: `북마크한 카페의 상세 정보를 확인해보세요.`,
};

export default function BookmarkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <BookmarkDetailClient params={params} />;
}