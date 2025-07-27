'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFinishResetPassword } from '@/hooks/supabase/useFinishResetPassword';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import BackgroundCards from '@/components/shared/FallingCards';

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
        <span className="text-3xl text-white text-shadow-black font-pretendard font-bold">
          Cafe Masters
        </span>
        <div className="z-10 p-5 rounded-xl bg-white shadow-main-shadow">
          <form className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4">
            <p className="text-center text-3xl font-bold font-dpixel">
              비밀번호 재설정
            </p>
            <div className="flex gap-4 justify-between items-center">
              <span className="font-dpixel text-lg">새 비밀번호</span>
              <input
                type="password"
                value={newPassword}
                placeholder="******"
                className="border-gray-400"
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-4 justify-between items-center">
              <span className="font-dpixel text-lg">비밀번호 확인</span>
              <input
                type="password"
                value={newPasswordConfirm}
                placeholder="******"
                className="border-gray-400"
                onChange={e => setNewPasswordConfirm(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="bg-main w-full py-1 hover:bg-opacity-70 hover:cursor-pointer"
              disabled={newPassword !== newPasswordConfirm}
              onClick={handleSubmit}
              aria-label="완료 버튼, 재설정 완료 화면으로 이동합니다."
            >
              <span className="font-dpixel text-lg text-white">완료</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-blue-500 w-full py-1 hover:bg-opacity-70 hover:cursor-pointer"
              aria-label="취소 버튼, 초기 화면으로 돌아갑니다."
            >
              <span className="font-dpixel text-lg text-white">취소</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
