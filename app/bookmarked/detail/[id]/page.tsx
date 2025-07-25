import { Metadata } from 'next';
import { IPageProps } from '@/types/shared/page';
import BookmarkedDetailClient from '@/components/bookmarked/BookmarkedDetailClient';

export const metadata: Metadata = {
  title: `카페 상세 정보 : Cafe Masters`,
  description: `북마크된 카페의 상세 정보를 확인해보세요.`,
};

export default function BookmarkedDetailPage(props: IPageProps) {
  return <BookmarkedDetailClient {...props} />;
}