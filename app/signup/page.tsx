import { Metadata } from 'next';
import SignUpClient from '@/components/signup/SignUpClient';

export const metadata: Metadata = {
  title: '회원가입 : Cafe Masters',
  description: '회원가입 페이지입니다.',
};

export default function SignUp() {
  return <SignUpClient />;
}