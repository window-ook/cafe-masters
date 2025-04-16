import { Metadata } from 'next';
import { PageProps } from 'types/common';
import CollectedDetailUI from './ui';

export const metadata: Metadata = {
  title: `카드 상세 정보 | Cafe Masters`,
  description: `수집한 카드의 상세 정보를 확인해보세요.`,
};

export default function CollectedDetail(props: PageProps) {
  return <CollectedDetailUI {...props} />;
}
