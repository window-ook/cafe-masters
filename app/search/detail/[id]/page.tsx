import { Metadata } from 'next';
import { IPageProps } from '@/types/shared/page';
import SearchedCafeDetailClient from '@/components/search/SearchedCafeDetailClient';

export const metadata: Metadata = {
  title: `카페 상세 정보 | Cafe Masters`,
  description: `검색 결과 카페의 상세 정보를 확인해보세요.`,
};

export default function SearchDetailPage(props: IPageProps) {
  return <SearchedCafeDetailClient {...props} />;
}
