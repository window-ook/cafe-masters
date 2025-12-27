'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyOtpCode } from '@/hooks/supabase/authentication';
import { IMAGE_PATHS } from '@/lib/paths';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/shared/Button';
import { useUIStore } from '@/stores';

export default function SignUpVerifyClient() {
  const router = useRouter();

  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  const [otpValue, setOtpValue] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const { verifyOtpCode, verifyOtpPending } = useVerifyOtpCode();

  useEffect(() => {
    const email = sessionStorage.getItem('signup_email');
    if (!email) {
      router.replace('/signup');
      return;
    }

    setUserEmail(email);
  }, [router]);

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6) return;

    verifyOtpCode({ email: userEmail, otp: otpValue });
  };

  if (!userEmail) return null;

  return (
    <main className="area flex h-screen w-screen items-center justify-center">
      <div className="via-main-900 absolute inset-0 bg-gradient-to-br from-gray-900 to-green-900" />
      <div className="bg-main/30 absolute top-20 -left-20 h-96 w-96 animate-pulse rounded-full blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-96 w-96 animate-pulse rounded-full bg-purple-200/50 blur-3xl delay-1000" />
      <div className="bg-main-light/20 absolute top-1/3 left-1/2 h-64 w-64 animate-pulse rounded-full blur-3xl delay-500" />
      <section className="relative z-10 flex flex-col items-center gap-4">
        <header className="flex">
          <Image
            src={IMAGE_PATHS.LOGO_IMG}
            width={32}
            height={32}
            alt="로고 아이콘"
            className="size-8"
          />
          <span className="text-3xl font-bold text-white [text-shadow:0_0_10px_rgba(135,90,173,1),0_4px_8px_rgba(0,0,0,0.9)]">
            CAFE MASTERS
          </span>
        </header>

        <div className="auth-form-layout">
          <form
            className="flex w-80 max-w-(--breakpoint-lg) flex-col gap-4 sm:w-96"
            onSubmit={onOtpSubmit}
          >
            <p
              className={`auth-form-title ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
            >
              인증 코드 입력
            </p>
            <p
              className={`text-center text-sm text-gray-600 ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
            >
              {userEmail}로 전송된 6자리 인증 코드를 입력하세요.
            </p>

            <div className="flex w-full flex-col gap-2">
              <label htmlFor="otp" className="block text-sm font-bold">
                인증 코드
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                data-testid="verification-code-input"
                value={otpValue}
                onChange={e => setOtpValue(e.target.value)}
                placeholder="6자리 인증 코드를 입력하세요"
                autoComplete="one-time-code"
                maxLength={6}
                disabled={verifyOtpPending}
                className="focus:border-main block w-full rounded-lg border-1 bg-gray-50 p-2.5 text-sm focus:outline-none"
              />
              {otpValue.length > 0 && otpValue.length < 6 && (
                <p className="text-sm text-red-600">
                  인증 코드는 6자리여야 합니다.
                </p>
              )}
            </div>

            <Button
              type="submit"
              aria-label="인증 코드 제출 버튼"
              dataTestId="button-submit-email-verification-code"
              disabled={verifyOtpPending || otpValue.length !== 6}
              text="인증 완료"
              customClassName="w-full"
            />

            <p className="auth-form-mention text-center">
              <Link
                href="/signup"
                aria-label="회원가입 페이지로 돌아가기"
                className="cursor-pointer"
              >
                <span className="text-main font-bold">처음으로 돌아가기</span>
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
