'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyOtpCode } from '@/hooks/supabase/authentication';
import { IMAGE_PATHS } from '@/lib/paths';
import Link from 'next/link';
import Image from 'next/image';
import RisingCards from '@/components/shared/RisingCards';
import Button from '@/components/shared/Button';

export default function SignUpVerifyClient() {
  const router = useRouter();

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
    <main className="area h-screen w-screen flex justify-center items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-main-900 to-green-900" />
      <div className="absolute -left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-main/30 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-96 w-96 animate-pulse rounded-full bg-purple-200/50 blur-3xl delay-1000" />
      <div className="absolute left-1/2 top-1/3 h-64 w-64 animate-pulse rounded-full bg-main-light/20 blur-3xl delay-500" />
      <RisingCards />
      <section className="relative z-10 flex flex-col items-center gap-4">
        <header className="flex">
          <Image
            src={IMAGE_PATHS.RISING_CARDS_BACKGROUND}
            width={32}
            height={32}
            alt="로고 아이콘"
            className="w-8 h-8"
          />
          <span className="text-3xl text-white text-shadow-black font-bold">
            Cafe Masters
          </span>
        </header>

        <div className="auth-form-layout">
          <form
            className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4"
            onSubmit={onOtpSubmit}
          >
            <p className="auth-form-title">인증 코드 입력</p>
            <p className="text-sm text-gray-600 text-center">
              {userEmail}로 전송된 6자리 인증 코드를 입력하세요.
            </p>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="otp" className="block text-sm font-bold">인증 코드</label>
              <input
                id="otp"
                name="otp"
                type="text"
                data-testid="verification-code-input"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="6자리 인증 코드를 입력하세요"
                autoComplete="one-time-code"
                maxLength={6}
                disabled={verifyOtpPending}
                className="block w-full p-2.5 rounded-lg bg-gray-50 text-sm border-1 focus:outline-none focus:border-main"
              />
              {otpValue.length > 0 && otpValue.length < 6 && (
                <p className='text-red-600 text-sm'>인증 코드는 6자리여야 합니다.</p>
              )}
            </div>

            <Button
              type="submit"
              aria-label="인증 코드 제출 버튼"
              dataTestId="button-submit-email-verification-code"
              disabled={verifyOtpPending || otpValue.length !== 6}
              text='인증 완료'
              customClassName="w-full"
            />

            <p className="auth-form-mention text-center">
              <Link
                href="/signup"
                aria-label="회원가입 페이지로 돌아가기"
                className="cursor-pointer"
              >
                <span className="font-bold text-main">처음으로 돌아가기</span>
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}