'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import Image from 'next/image';
import Head from 'next/head';
import AuthBackgroundCards from 'components/auth/auth-background-cards';

export default function ResetpasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const textStyle = `font-dpixel text-lg`;

  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const finishResetMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw new Error(error.message);
    },
    onError: (error: Error) => {
      console.error(error);
      alert('새로운 비밀번호는 기존 비밀번호와 달라야합니다.');
    },
    onSuccess: async () => {
      await supabase.auth.signOut();
      alert('비밀번호를 재설정했습니다!');
      router.push('/resetpassword/complete');
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    finishResetMutation.mutate();
  };

  const handleCancel = async (e: any) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>비밀번호 재설정 | Cafe Masters</title>
        <meta name="description" content={`새로운 비밀번호를 설정하세요.`} />
      </Head>
      <main className="area h-screen w-screen flex justify-center items-center">
        <AuthBackgroundCards />
        <div className="flex flex-col items-center gap-4">
          <Image
            alt="텍스트 로고 이미지"
            src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/logo_text.webp"
            width={180}
            height={180}
            className="w-auto h-auto"
          />
          <div className="z-10 p-5 rounded-xl bg-white shadow-mainShadow">
            <form className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4">
              <p className="text-center text-3xl font-bold font-dpixel">
                비밀번호 재설정
              </p>
              <div className="flex gap-4 justify-between items-center">
                <span className={textStyle}>새 비밀번호</span>
                <input
                  type="password"
                  value={newPassword}
                  placeholder="******"
                  className="border-gray-400"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-4 justify-between items-center">
                <span className={textStyle}>비밀번호 확인</span>
                <input
                  type="password"
                  value={newPasswordConfirm}
                  placeholder="******"
                  className="border-gray-400"
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
              </div>
              <button
                className="bg-main w-full py-1 hover:bg-opacity-70 hover:cursor-pointer"
                disabled={newPassword !== newPasswordConfirm}
                onClick={handleSubmit}
                aria-label="완료 버튼, 재설정 완료 화면으로 이동합니다."
              >
                <span className={`${textStyle} text-white`}>완료</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-blue-500 w-full py-1 hover:bg-opacity-70 hover:cursor-pointer"
                aria-label="취소 버튼, 초기 화면으로 돌아갑니다."
              >
                <span className={`${textStyle} text-white`}>취소</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
