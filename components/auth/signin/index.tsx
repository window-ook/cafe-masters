'use client';

import { useState } from 'react';
import { useAuthView } from 'config/auth-view-provider';
import { useSigninMutation } from 'hooks/useSigninMutation';
import { useResetPasswordMutation } from 'hooks/useResetPasswordMutation';
import { signinWithKakao } from 'utils/supabase/signinWithKakao';
import {
  AuthFormCardStyle,
  AuthFormMentionStyle,
  AuthFormTitleStyle,
  KakaoButtonStyle,
} from 'utils/styles';
import { checkEmailValid } from 'utils/common';
import UserForm from '../shared/user-form';
import ResetpasswordForm from './resetpassword-form';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [resetRequired, setResetRequired] = useState(false);
  const [resetRequested, setResetRequested] = useState('');

  const { setView } = useAuthView();

  const signinMutation = useSigninMutation();

  const resetPasswordMutation = useResetPasswordMutation();

  const checkEmail = () => {
    let isValid = true;

    if (!checkEmailValid(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      isValid = false;
    } else setEmailError(null);

    return isValid;
  };

  const handleSignin = () => {
    if (checkEmail()) signinMutation.mutate({ email, password });
  };

  const handleResetPassword = async () => {
    try {
      const message = await resetPasswordMutation.mutateAsync(email);
      setResetRequested(message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={AuthFormCardStyle}>
      {resetRequired ? (
        <ResetpasswordForm
          email={email}
          setEmail={setEmail}
          resetRequested={resetRequested}
          resetFn={handleResetPassword}
          cancelFn={() => setResetRequired(false)}
        />
      ) : (
        <div>
          <p className={AuthFormTitleStyle}>로그인</p>
          <form className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4">
            <UserForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
            />
            <span className="text-red-500">{emailError}</span>
            <button
              aria-label="로그인 버튼"
              className="w-full py-1 bg-main hover:bg-opacity-70 hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleSignin}
              disabled={signinMutation.isPending || password.length < 6}
            >
              <span className="font-dpixel text-white">접속하기</span>
            </button>
            <button
              aria-label="비밀번호 재설정 폼 열기 버튼"
              className="bg-blue-600 w-full py-1 hover:bg-opacity-70 hover:cursor-pointer"
              onClick={() => setResetRequired(true)}
            >
              <span className="font-dpixel text-white">비밀번호 재설정</span>
            </button>
            <button
              aria-label="카카오 로그인 버튼"
              className={KakaoButtonStyle}
              onClick={() => signinWithKakao()}
            >
              <span className="font-dpixel text-white">카카오 로그인</span>
            </button>
            <span color="gray" className={AuthFormMentionStyle}>
              계정이 없으신가요?{' '}
              <button
                aria-label="회원가입 폼 열기 버튼"
                onClick={() => setView('SIGNUP')}
                className="hover:cursor-pointer hover:bg-gray-100"
              >
                <span className="font-bold font-dpixel text-main">
                  회원가입
                </span>
              </button>
            </span>
          </form>
        </div>
      )}
    </div>
  );
}
