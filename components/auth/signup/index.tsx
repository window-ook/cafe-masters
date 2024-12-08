'use client';

import { useState } from 'react';
import { useSignupMutation } from 'hooks/useSignupMutation';
import { useAuthView } from 'config/auth-view-provider';
import { signinWithKakao } from 'utils/supabase/signinWithKakao';
import {
  AuthFormCardStyle,
  AuthFormMentionStyle,
  AuthFormTitleStyle,
  KakaoButtonStyle,
} from 'utils/styles';
import { checkEmailValid } from 'utils/common';
import UserForm from '../shared/user-form';
import OtpForm from './otp-form';
import useVerifyOtpMutation from 'hooks/useVerifyOtpMutation';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  const [otp, setOtp] = useState('');

  const { setView } = useAuthView();

  const signupMutation = useSignupMutation();

  const verifyOtpMutation = useVerifyOtpMutation();

  const checkEmail = () => {
    let isValid = true;

    if (!checkEmailValid(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      isValid = false;
    } else setEmailError(null);

    return isValid;
  };

  const handleSignUp = () => {
    if (checkEmail()) {
      signupMutation.mutate({ email, password });
      setConfirmationRequired(true);
    }
  };

  const handleVerifyOtp = () => {
    if (confirmationRequired) {
      verifyOtpMutation.mutate({ email, otp });
      setConfirmationRequired(true);
    } else handleSignUp();
  };

  return (
    <div className={AuthFormCardStyle}>
      <p className={AuthFormTitleStyle}>회원가입</p>
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
          onClick={handleVerifyOtp}
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
          className={KakaoButtonStyle}
          onClick={() => signinWithKakao()}
        >
          <span className="font-dpixel text-lg text-white">
            카카오로 회원가입
          </span>
        </button>
        <span color="gray" className={AuthFormMentionStyle}>
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
