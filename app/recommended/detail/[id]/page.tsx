import { Metadata } from 'next';
import { PageProps } from 'types/common';
import RecommendedCafeDetailClient from '@/components/recommendation/RecommendedCafeDetailClient';


export const metadata: Metadata = {
  title: `카페 상세 정보 | Cafe Masters`,
  description: `추천 카페의 상세 정보를 확인해보세요.`,
};

export default function RecommendedDetailPage(props: PageProps) {
  return <RecommendedCafeDetailClient {...props} />;
}
