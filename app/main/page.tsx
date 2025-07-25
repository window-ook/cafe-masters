import { Metadata } from 'next';
import MainClient from '@/components/cafe/MainClient';

export const metadata: Metadata = {
  title: '메뉴 페이지 | Cafe Masters',
  description: '원하는 메뉴를 선택해보세요.',
};

export default function MainPage() {
  return <MainClient />;
}
