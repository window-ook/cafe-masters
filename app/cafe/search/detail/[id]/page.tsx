import { Metadata } from 'next';
import { PageProps } from 'types/common';
import SearchDetailUI from './ui';

export const metadata: Metadata = {
  title: `카페 상세 정보 | Cafe Masters`,
  description: `검색 결과 카페의 상세 정보를 확인해보세요.`,
};

export default function SearchDetail(props: PageProps) {
  return <SearchDetailUI {...props} />;
}
