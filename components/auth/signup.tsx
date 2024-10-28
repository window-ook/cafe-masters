'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { signInWithKakao } from 'utils/supabase/signinKakao';
import {
  getAuthFormCardStyle,
  getAuthFormMentionStyle,
  getAuthFormTitleStyle,
  getKakaoButtonStyle,
} from 'utils/styles';
import UserForm from './user-form';
import OtpForm from './otp-form';

export default function Signup({ setView, checkEmailVaild }: any) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  const [otp, setOtp] = useState('');

  const supabase = createBrowserSupabaseClient();

  const signupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_API_REQUEST_URI}/signup/confirm`,
        },
      });

      if (error) throw new Error(error.message);
      if (data) setConfirmationRequired(true);
    },

    onError: (error: Error) => console.error(error),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.verifyOtp({
        type: 'signup',
        email,
        token: otp,
      });

      if (error) throw new Error(error.message);
      if (data) setConfirmationRequired(true);
    },

    onError: (error: Error) => console.error(error),
  });

  const checkEmail = () => {
    let isValid = true;

    if (!checkEmailVaild(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      isValid = false;
    } else setEmailError(null);

    return isValid;
  };

  const handleSignUp = () => {
    if (checkEmail()) signupMutation.mutate();
  };

  return (
    <div className={getAuthFormCardStyle()}>
      <p className={getAuthFormTitleStyle()}>회원가입</p>
      <form className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4">
        {confirmationRequired ? (
          <OtpForm otp={otp} setOtp={setOtp} />
        ) : (
          <UserForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        )}
        <span className="text-red-500">{emailError}</span>
        <span>*비밀번호는 최소 6자 이상 입력해야 합니다.</span>
        <button
          aria-label="인증 코드 확인 버튼 | 회원가입 요청 버튼"
          className="w-full py-1 bg-main hover:bg-opacity-70 hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={() => {
            if (confirmationRequired) verifyOtpMutation.mutate();
            else handleSignUp();
          }}
          disabled={
            confirmationRequired
              ? verifyOtpMutation.isPending || otp.length < 6
              : signupMutation.isPending || password.length < 6
          }
        >
          <span className="font-dpixel text-lg text-white">
            {confirmationRequired ? '인증 코드 확인' : '가입하기'}
          </span>
        </button>
        <button
          aria-label="카카오 로그인 버튼"
          className={getKakaoButtonStyle()}
          onClick={() => signInWithKakao()}
        >
          <span className="font-dpixel text-lg text-white">
            카카오로 회원가입
          </span>
        </button>
        <span color="gray" className={getAuthFormMentionStyle()}>
          이미 계정이 있으신가요?{' '}
          <button
            aria-label="로그인 폼 열기 버튼"
            onClick={() => setView('SIGNIN')}
            className="hover:cursor-pointer hover:bg-gray-100"
          >
            <span className="font-bold font-dpixel text-main">로그인 하기</span>
          </button>
        </span>
      </form>
    </div>
  );
}
