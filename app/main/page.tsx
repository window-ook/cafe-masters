import { Metadata } from 'next';
import MainClient from '@/components/main/MainClient';

export const metadata: Metadata = {
  title: '메인 페이지 : CAFE MASTERS',
  description: '검색 결과, 수집한 카페, 북마크한 카페, 추천 카페 중 선택하여 카페를 확인해보세요.',
  alternates: {
    canonical: 'https://www.cafe-masters.com/main'
  },
};

export default function MainPage() {
  return <MainClient />;
}