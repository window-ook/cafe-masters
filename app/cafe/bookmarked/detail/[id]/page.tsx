import { Metadata } from 'next';
import { PageProps } from 'types/common';
import BookmarkedDetailUI from './ui';

export const metadata: Metadata = {
  title: `카페 상세 정보 | Cafe Masters`,
  description: `북마크된 카페의 상세 정보를 확인해보세요.`,
};

export default function BookmarkedDetail(props: PageProps) {
  return <BookmarkedDetailUI {...props} />;
}
