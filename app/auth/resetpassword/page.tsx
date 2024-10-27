'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { Card, Button } from '@mui/material';
import Image from 'next/image';

export default function ResetpasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

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
      alert('기존 비밀번호와 다른 비밀번호를 입력해주세요.');
    },
    onSuccess: () => {
      alert('비밀번호를 재설정했습니다!');
      router.push('/');
    },
  });

  return (
    <main className="area h-screen w-screen flex justify-center items-center">
      <ul className="circles z-0">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="flex flex-col items-center gap-4">
        <Image
          alt="텍스트 로고"
          src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/logo_text.webp"
          width={180}
          height={180}
          className="w-auto h-auto"
        />
        <Card className="z-10 p-5 rounded-xl bg-white shadow-mainShadow">
          <form className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4">
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
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-4 justify-between items-center">
              <span className="font-dpixel text-lg">비밀번호 확인</span>
              <input
                type="password"
                value={newPasswordConfirm}
                placeholder="******"
                className="border-gray-400"
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
            </div>
            <Button
              className="bg-main w-full hover:bg-opacity-70 hover:cursor-pointer"
              disabled={newPassword !== newPasswordConfirm}
              onClick={() => finishResetMutation.mutate()}
            >
              <span className="font-dpixel text-lg text-white">완료</span>
            </Button>
            <Button
              onClick={() => router.push('/')}
              className="bg-blue-500 w-full hover:bg-opacity-70 hover:cursor-pointer"
            >
              <span className="font-dpixel text-lg text-white">취소</span>
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
