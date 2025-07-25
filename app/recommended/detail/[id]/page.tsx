import { Metadata } from 'next';
import RecommendedCafeDetailClient from '@/components/recommendation/RecommendedCafeDetailClient';
import { PageProps } from '@/types/shared/page';

export const metadata: Metadata = {
  title: `카페 상세 정보 | Cafe Masters`,
  description: `추천 카페의 상세 정보를 확인해보세요.`,
};

export default function RecommendedDetailPage(props: PageProps) {
  return <RecommendedCafeDetailClient {...props} />;
}
