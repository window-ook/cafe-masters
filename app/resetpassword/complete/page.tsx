'use client';

import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { Card } from '@mui/material';
import Image from 'next/image';

export default function ResetPasswordCompletePage() {
  const supabase = createBrowserSupabaseClient();

  const handleRoute = async () => {
    await supabase.auth.signOut();
    window.close();
  };

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
          <div className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4">
            <p className="text-center text-3xl font-bold font-dpixel">
              비밀번호 재설정 완료
            </p>
            <span>초기 화면으로 돌아가 다시 로그인하세요!</span>
            <button className="bg-main text-white w-full" onClick={handleRoute}>
              돌아가기
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}
