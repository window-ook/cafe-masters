import { Metadata } from 'next';
import ResetPasswordCompleteForm from '@/components/reset-password/ResetPasswordCompleteForm';

export const metadata: Metadata = {
  title: '비밀번호 재설정 완료 : CAFE MASTERS',
  description: '비밀번호 재설정을 완료페이지입니다.',
  alternates: {
    canonical: 'https://www.cafe-masters.com/reset-password/complete'
  },
};

export default function ResetPasswordCompletePage() {
  return <ResetPasswordCompleteForm />;
}