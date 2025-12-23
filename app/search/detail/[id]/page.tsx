import { Metadata } from 'next';
import SearchDetailClient from '@/components/search/detail/SearchDetailClient';

interface ISearchDetailPage {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: ISearchDetailPage): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const cafeName = resolvedSearchParams?.name as string;

  return {
    title: `${cafeName} 상세 정보 : CAFE MASTERS`,
    description: `검색 결과 카페 '${cafeName}'의 상세 정보를 확인해보세요.`,
    alternates: {
      canonical: `https://www.cafe-masters.com/search/detail/${resolvedSearchParams?.id}`
    },
  };
}

export default async function SearchDetailPage({ params, searchParams }: ISearchDetailPage) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return <SearchDetailClient params={resolvedParams} searchParams={resolvedSearchParams} />;
}