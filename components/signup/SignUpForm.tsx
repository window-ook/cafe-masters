'use client';

import React, { useState } from 'react';
import { useSignUp } from '@/hooks/supabase/useSignUp';
import { signinWithKakao } from '@/utils/supabase/signinWithKakao';
import { useVerifyOtpCode } from '@/hooks/supabase/useVerifyOtpCode';
import {
  authFormCardStyle,
  authFormMentionStyle,
  authFormTitleStyle,
  kakaoButtonStyle,
} from '@/utils/styles';
import { handleEmailValid } from '@/utils/shared/auth';
import Link from 'next/link';
import UserForm from '@/components/shared/UserForm';
import CodeForm from '@/components/signup/CodeForm';

export default function SignUpForm() {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmationRequired, setConfirmationRequired] =
    useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');

  const { signUp, signUpPending } = useSignUp();
  const { verifyOtpCode, verifyOtpPending } = useVerifyOtpCode();

  const handleEmail = () => {
    let isValid = true;

    if (!handleEmailValid(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      isValid = false;
    } else setEmailError(null);

    return isValid;
  };

  const handleSignup = () => {
    if (handleEmail()) {
      signUp({ email, password });
      setConfirmationRequired(true);
    }
  };

  const handleVerifyOtp = () => {
    if (confirmationRequired) {
      verifyOtpCode({ email, otp });
      alert('회원가입이 완료되었습니다');
    } else handleSignup();
  };

  return (
    <main className={authFormCardStyle}>
      <p className={authFormTitleStyle}>회원가입</p>
      <form
        className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4"
        onKeyDown={e => {
          if (e.key == 'Enter') handleVerifyOtp();
        }}
      >
        {confirmationRequired ? (
          <CodeForm otp={otp} setOtp={setOtp} />
        ) : (
          <UserForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        )}
        <p className="text-red-500">{emailError}</p>
        <p>*비밀번호는 최소 6자 이상 입력해야 합니다.</p>
        <button
          type="button"
          data-cy="otp-signup-button"
          aria-label="인증 코드 확인 버튼 | 회원가입 요청 버튼"
          className="w-full py-1 bg-main hover:bg-opacity-70 hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handleVerifyOtp}
          disabled={
            confirmationRequired
              ? verifyOtpPending || otp.length < 6
              : signUpPending || password.length < 6
          }
        >
          <span className="font-dpixel text-lg text-white">
            {confirmationRequired ? '인증 코드 확인' : '가입하기'}
          </span>
        </button>
        <button
          type="button"
          aria-label="카카오 로그인 버튼"
          className={kakaoButtonStyle}
          onClick={() => signinWithKakao()}
        >
          <span className="font-dpixel text-lg text-white">
            카카오로 회원가입
          </span>
        </button>
        <p color="gray" className={authFormMentionStyle}>
          이미 계정이 있으신가요?{' '}
          <Link
            href="/signin"
            data-cy="open-signin-button"
            aria-label="로그인 페이지로 이동 버튼"
            className="hover:cursor-pointer hover:bg-gray-100"
          >
            <span className="font-bold font-dpixel text-main">로그인 하기</span>
          </Link>
        </p>
      </form>
    </main>
  );
}
