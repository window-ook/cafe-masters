import { Metadata } from 'next';
import OnBoardingClient from '@/components/onboarding/OnBoardingClient';

export const metadata: Metadata = {
  title: '프로필 설정 페이지 : CAFE MASTERS',
  description: '프로필 설정 페이지입니다.',
  alternates: {
    canonical: 'https://www.cafe-masters.com/onboarding/profile-setup'
  },
};

export default function OnBoardingPage() {
  return <OnBoardingClient />;
}