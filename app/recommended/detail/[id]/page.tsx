import { Metadata } from 'next';
import { IPageProps } from '@/types/shared/page';
import RecommendedDetailClient from '@/components/recommended/RecommendedDetailClient';

export const metadata: Metadata = {
  title: `카페 상세 정보 | Cafe Masters`,
  description: `추천 카페의 상세 정보를 확인해보세요.`,
};

export default function RecommendedDetailPage(props: IPageProps) {
  return <RecommendedDetailClient {...props} />;
}
