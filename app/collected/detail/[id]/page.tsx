import { Metadata } from 'next';
import { PageProps } from 'types/common';
import CollectedCafeDetailClient from '@/components/collected/CollectedCafeDetailClient';

export const metadata: Metadata = {
  title: `카드 상세 정보 | Cafe Masters`,
  description: `수집한 카드의 상세 정보를 확인해보세요.`,
};

export default function CollectedDetailPage(props: PageProps) {
  return <CollectedCafeDetailClient {...props} />;
}
