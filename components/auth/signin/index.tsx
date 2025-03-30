'use client';

import React, { useState } from 'react';
import { useSigninMutation } from 'hooks/mutation/useSigninMutation';
import { useRequestResetPasswordMutation } from 'hooks/mutation/useRequestResetPasswordMutation';
import { signinWithKakao } from 'utils/supabase/signinWithKakao';
import { handleEmailValid } from '../shared/utils';
import {
  AuthFormCardStyle,
  AuthFormMentionStyle,
  AuthFormTitleStyle,
  KakaoButtonStyle,
} from 'utils/styles';
import { SignProps } from 'app/auth/page';
import dynamic from 'next/dynamic';
import UserForm from '../shared/user-form';

const ResetpasswordForm = dynamic(() => import('./resetpassword-form'), {
  ssr: false,
});

export default function Signin({ setViewAction }: SignProps) {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [resetRequired, setResetRequired] = useState<boolean>(false);
  const [resetRequested, setResetRequested] = useState<string>('');

  const signinMutation = useSigninMutation();
  const requestResetPasswordMutation = useRequestResetPasswordMutation();

  const handleEmail = () => {
    let isValid = true;

    if (!handleEmailValid(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      isValid = false;
    } else setEmailError(null);

    return isValid;
  };

  const handleSignin = () => {
    if (handleEmail()) {
      const trimmedEmail: string = email.trim();
      signinMutation.mutate({ email: trimmedEmail, password });
    }
  };

  const handleRequest = async () => {
    try {
      const message = await requestResetPasswordMutation.mutateAsync(email);
      setResetRequested(message);
    } catch (error) {
      console.error('비밀번호 재설정 이메일 요청 error', error);
    }
  };

  return (
    <main className={AuthFormCardStyle}>
      {!resetRequired ? (
        <div>
          <p className={AuthFormTitleStyle}>로그인</p>
          <form
            className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4"
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
              data-cy="signin-button"
              type="button"
              aria-label="로그인 버튼"
              className="w-full py-1 bg-main hover:bg-opacity-70 hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleSignin}
              disabled={signinMutation.isPending || password.length < 6}
            >
              <span className="font-dpixel text-white">접속하기</span>
            </button>
            <button
              type="button"
              data-cy="open-reset-button"
              aria-label="비밀번호 재설정 폼 열기 버튼"
              className="bg-blue-600 w-full py-1 hover:bg-opacity-70 hover:cursor-pointer"
              onClick={() => setResetRequired(true)}
            >
              <span className="font-dpixel text-white">비밀번호 재설정</span>
            </button>
            <button
              data-cy="kakaosignin-button"
              type="button"
              aria-label="카카오 로그인 버튼"
              className={KakaoButtonStyle}
              onClick={() => signinWithKakao()}
            >
              <span className="font-dpixel text-white">카카오 로그인</span>
            </button>
            <span color="gray" className={AuthFormMentionStyle}>
              계정이 없으신가요?{' '}
              <button
                type="button"
                data-cy="open-signup-button"
                aria-label="회원가입 폼 열기 버튼"
                onClick={e => {
                  e.preventDefault();
                  setViewAction('SIGNUP');
                }}
                className="hover:cursor-pointer hover:bg-gray-100"
              >
                <span className="font-bold font-dpixel text-main">
                  회원가입
                </span>
              </button>
            </span>
          </form>
        </div>
      ) : (
        <ResetpasswordForm
          email={email}
          setEmail={setEmail}
          resetRequested={resetRequested}
          resetFn={handleRequest}
          cancelFn={() => setResetRequired(false)}
        />
      )}
    </main>
  );
}
