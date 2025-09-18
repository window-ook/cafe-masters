import { Metadata } from 'next';
import SignUpPageClient from '@/components/signup/SignUpRequestClient';

export const metadata: Metadata = {
  title: '회원가입 : Cafe Masters',
  description: '회원가입 페이지입니다.',
};

export default function SignUp() {
  return <SignUpPageClient />;
}