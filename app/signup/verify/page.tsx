import { Metadata } from 'next';
import SignUpVerifyClient from '@/components/signup/verify/SignUpVerifyClient';

export const metadata: Metadata = {
  title: '인증 코드 입력 : Cafe Masters',
  description: '이메일로 받은 인증 코드를 입력하세요.',
  alternates: {
    canonical: 'https://www.cafe-masters.com/signup/verify'
  },
};

export default function SignUpVerify() {
  return <SignUpVerifyClient />;
}