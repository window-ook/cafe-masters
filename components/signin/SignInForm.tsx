'use client';

import React, { useState } from 'react';
import { useSignIn } from '@/hooks/supabase/user';
import { signinWithKakao } from '@/utils/supabase/signinWithKakao';
import { validateEmailByRegex } from '@/utils/shared/auth';
import {
  authFormCardStyle,
  authFormMentionStyle,
  authFormTitleStyle,
  kakaoButtonStyle,
} from '@/utils/styles';
import Link from 'next/link';
import UserForm from '@/components/shared/UserForm';
import ResetpasswordForm from './ResetPasswordForm';

export default function SignInForm() {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [resetRequired, setResetRequired] = useState<boolean>(false);

  const { signIn, isPending } = useSignIn();

  const handleEmail = () => {
    let isValid = true;

    if (!validateEmailByRegex(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      isValid = false;
    } else setEmailError(null);

    return isValid;
  };

  const handleSignin = () => {
    if (handleEmail()) {
      const trimmedEmail: string = email.trim();
      signIn({ email: trimmedEmail, password });
    }
  };

  return (
    <main className={authFormCardStyle}>
      {!resetRequired ? (
        <div>
          <p className={authFormTitleStyle}>로그인</p>
          <form
            className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4"
            onKeyDown={e => {
              if (e.key === 'Enter') handleSignin();
            }}
          >
            <UserForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
            />
            <p className="text-red-500">{emailError}</p>
            <button
              type="button"
              data-cy="signin-button"
              aria-label="로그인 버튼"
              className="w-full py-1 bg-main hover:bg-opacity-70 hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleSignin}
              disabled={isPending || password.length < 6}
            >
              <span className=" text-white">접속하기</span>
            </button>
            <button
              type="button"
              data-cy="open-reset-button"
              aria-label="비밀번호 재설정 폼 열기 버튼"
              className="bg-blue-600 w-full py-1 hover:bg-opacity-70 hover:cursor-pointer"
              onClick={() => setResetRequired(true)}
            >
              <span className=" text-white">비밀번호 재설정</span>
            </button>
            <button
              type="button"
              data-cy="kakaosignin-button"
              aria-label="카카오 로그인 버튼"
              className={kakaoButtonStyle}
              onClick={() => signinWithKakao()}
            >
              <span className=" text-white">카카오 로그인</span>
            </button>
            <span color="gray" className={authFormMentionStyle}>
              계정이 없으신가요?{' '}
              <Link
                href="/signup"
                data-cy="open-signup-button"
                aria-label="회원가입 페이지로 이동 버튼"
                className="hover:cursor-pointer hover:bg-gray-100"
              >
                <span className="font-bold  text-main">
                  회원가입
                </span>
              </Link>
            </span>
          </form>
        </div>
      ) : (
        <ResetpasswordForm
        />
      )}
    </main>
  );
}
