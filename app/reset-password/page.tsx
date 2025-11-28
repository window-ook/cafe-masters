import { Metadata } from 'next';
import ResetPasswordForm from '@/components/reset-password/ResetPasswordForm';

export const metadata: Metadata = {
  title: '비밀번호 재설정 : Cafe Masters',
  description: '새로운 비밀번호를 설정하세요.',
  alternates: {
    canonical: 'https://www.cafe-masters.com/reset-password'
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}