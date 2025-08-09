import { Metadata } from 'next';
import SearchDetailClient from '@/components/search/detail/SearchDetailClient';

interface ISearchDetailPage {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: ISearchDetailPage): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const cafeName = resolvedSearchParams?.name as string;

  if (cafeName) {
    return {
      title: `${cafeName} 상세 정보 : Cafe Masters`,
      description: `검색 결과 카페 '${cafeName}'의 상세 정보를 확인해보세요.`,
    };
  }

  return {
    title: `카페 상세 정보 : Cafe Masters`,
    description: `검색 결과 카페의 상세 정보를 확인해보세요.`,
  };
}

export default function SearchDetailPage(props: ISearchDetailPage) {
  return <SearchDetailClient {...props} />;
}