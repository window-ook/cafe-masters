import { Metadata } from 'next';
import SearchDetailClient from '@/components/search/detail/SearchDetailClient';

export const metadata: Metadata = {
  title: `카페 상세 정보 : Cafe Masters`,
  description: `검색 결과 카페의 상세 정보를 확인해보세요.`,
};

interface IPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function SearchDetailPage(props: IPageProps) {
  return <SearchDetailClient {...props} />;
}