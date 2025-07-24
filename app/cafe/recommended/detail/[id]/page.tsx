import RecommendedDetailClient from '@/components/recommendation/RecommendedDetailClient';
import { Metadata } from 'next';
import { PageProps } from 'types/common';


export const metadata: Metadata = {
  title: `카페 상세 정보 | Cafe Masters`,
  description: `추천 카페의 상세 정보를 확인해보세요.`,
};

export default function RecommendedDetailPage(props: PageProps) {
  return <RecommendedDetailClient {...props} />;
}
