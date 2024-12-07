'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { signInWithKakao } from 'utils/supabase/signinKakao';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useAuthView } from 'config/auth-view-provider';
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
  const supabase = createBrowserSupabaseClient();

  const { setView } = useAuthView();

  const signinMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
    },

    onError: (error: Error) => {
      if (error.message) alert('이메일 또는 비밀번호를 잘못 입력했습니다.');
      else alert('알 수 없는 에러가 발생했습니다.');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_API_REQUEST_URI}/resetpassword`,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setResetRequested('이메일의 보관함을 확인해주세요.');
    },
    onError: (error: Error) => {
      console.error(error);
      alert('재요청은 60초가 지나야 가능합니다.');
    },
  });

  const checkEmail = () => {
    let isValid = true;

    if (!checkEmailValid(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      isValid = false;
    } else setEmailError(null);

    return isValid;
  };

  const handleSignIn = () => {
    if (checkEmail()) signinMutation.mutate();
  };

  return (
    <div className={AuthFormCardStyle}>
      {resetRequired ? (
        <ResetpasswordForm
          email={email}
          setEmail={setEmail}
          resetRequested={resetRequested}
          resetFn={() => resetPasswordMutation.mutate()}
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
              onClick={handleSignIn}
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
              onClick={() => signInWithKakao()}
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
