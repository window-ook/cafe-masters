import { Metadata } from 'next';
import SignInClient from '@/components/signin/SignInClient';

export const metadata: Metadata = {
  title: '로그인 : Cafe Masters',
  description: '로그인 페이지입니다.',
};

export default function SignIn() {
  return <SignInClient />;
}