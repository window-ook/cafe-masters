'use client';

import { createBrowserSupabaseClient } from 'utils/supabase/client';
import Head from 'next/head';
import BackgroundCards from '@/components/auth/shared/FallingCards';

export default function ResetPasswordCompletePage() {
  const supabase = createBrowserSupabaseClient();

  const handleWindow = async () => {
    await supabase.auth.signOut();
    window.close();
  };

  return (
    <>
      <Head>
        <title>비밀번호 재설정 완료 | Cafe Masters</title>
        <meta
          name="description"
          content={`비밀번호 재설정을 완료페이지입니다.`}
        />
      </Head>
      <main className="area h-screen w-screen flex justify-center items-center">
        <BackgroundCards />
        <div className="flex flex-col items-center gap-4">
          <span className="text-3xl text-white text-shadow-black font-pretendard font-bold">
            Cafe Masters
          </span>
          <div className="z-10 p-5 rounded-xl bg-white shadow-main-shadow">
            <div className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4">
              <p className="text-center text-3xl font-bold font-dpixel">
                비밀번호 재설정 완료
              </p>
              <span className="text-lg font-dpixel">
                초기 화면으로 돌아가 다시 로그인하세요!
              </span>
              <button
                type="button"
                className="bg-main w-full hover:bg-opacity-70 hover:cursor-pointer"
                onClick={handleWindow}
                aria-label="돌아가기 버튼, 초기 화면으로 돌아갑니다."
              >
                <span className="text-white font-dpixel">돌아가기</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
