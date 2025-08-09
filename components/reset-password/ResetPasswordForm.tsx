'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinishResetPassword } from '@/hooks/supabase/user';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import BackgroundCards from '@/components/shared/FallingCards';
import Button from '@/components/shared/Button';

export default function ResetPasswordForm() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');

  const { finishResetPassword } = useFinishResetPassword();

  const handleSubmit = () => {
    finishResetPassword(newPassword);
    alert('비밀번호를 재설정했습니다!');
    router.push('/reset-password/complete');
  };

  const handleCancel = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  return (
    <main className="area h-screen w-screen flex justify-center items-center">
      <BackgroundCards />
      <div className="flex flex-col items-center gap-4">
        <span className="text-3xl text-white text-shadow-black font-bold">
          Cafe Masters
        </span>
        <div className="z-10 p-5 rounded-xl bg-white shadow-main-shadow">
          <form className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4">
            <p className="text-center text-3xl font-bold ">
              비밀번호 재설정
            </p>
            <div className="flex gap-4 justify-between items-center">
              <span className=" text-lg">새 비밀번호</span>
              <input
                type="password"
                value={newPassword}
                placeholder="******"
                className="border-gray-400"
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-4 justify-between items-center">
              <span className=" text-lg">비밀번호 확인</span>
              <input
                type="password"
                value={newPasswordConfirm}
                placeholder="******"
                className="border-gray-400"
                onChange={e => setNewPasswordConfirm(e.target.value)}
              />
            </div>
            <Button
              type="button"
              aria-label="완료 버튼, 재설정 완료 화면으로 이동합니다."
              disabled={newPassword !== newPasswordConfirm}
              onClick={handleSubmit}
              text='완료'
            />
            <Button
              type="button"
              aria-label="취소 버튼, 초기 화면으로 돌아갑니다."
              onClick={handleCancel}
              customClassName="bg-blue-500"
              text='취소'
            />
          </form>
        </div>
      </div>
    </main>
  );
}
