'use client';

import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { useUIStore } from '@/stores';
import Button from '@/components/shared/Button';
import Logo from '@/components/shared/Logo';

export default function ResetPasswordCompleteForm() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const handleGoToMain = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  return (
    <main className="area flex h-screen w-screen items-center justify-center">
      <div className="px-6 flex flex-col items-center gap-8">
        <Logo />
        <div className="auth-glass-card">
          <div className="flex w-80 max-w-(--breakpoint-lg) flex-col gap-6 sm:w-96">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="size-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2
                className={`mb-2 text-2xl font-bold text-gray-800 ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
              >
                비밀번호 재설정 완료!
              </h2>
              <p
                className={`leading-relaxed text-gray-600 ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
              >
                새로운 비밀번호로 재설정이 완료되었습니다.
                <br />
                로그인 페이지에서 새 비밀번호로 로그인해주세요.
              </p>
            </div>

            <Button
              type="button"
              ariaLabel="로그인 페이지로 이동"
              onClick={handleGoToMain}
              text="로그인하러 가기"
              customClassName="w-full bg-main hover:bg-main/90"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
