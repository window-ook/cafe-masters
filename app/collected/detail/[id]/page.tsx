import { Metadata } from 'next';
import { IPageProps } from '@/types/shared/page';
import CollectedDetailClient from '@/components/collected/CollectedDetailClient';

export const metadata: Metadata = {
  title: `카드 상세 정보 | Cafe Masters`,
  description: `수집한 카드의 상세 정보를 확인해보세요.`,
};

export default function CollectedDetailPage(props: IPageProps) {
  return <CollectedDetailClient {...props} />;
}
