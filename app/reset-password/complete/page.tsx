import { Metadata } from 'next';
import ResetPasswordCompleteForm from '@/components/reset-password/ResetPasswordCompleteForm';

export const metadata: Metadata = {
  title: '비밀번호 재설정 완료 : Cafe Masters',
  description: '비밀번호 재설정을 완료페이지입니다.',
};

export default function ResetPasswordCompletePage() {
  return <ResetPasswordCompleteForm />;
}