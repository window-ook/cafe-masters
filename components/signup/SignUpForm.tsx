'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@/hooks/supabase/user';
import { signinWithKakao } from '@/utils/supabase/signinWithKakao';
import { useVerifyOtpCode } from '@/hooks/supabase/user';
import { signUpFormSchema, SignUpFormData, otpFormSchema, OtpFormData } from '@/schema/auth';
import Link from 'next/link';
import InputField from '@/components/shared/InputField';
import Button from '../shared/Button';

export default function SignUpForm() {
  const [confirmationRequired, setConfirmationRequired] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const { signUp, signUpPending } = useSignUp();
  const { verifyOtpCode, verifyOtpPending } = useVerifyOtpCode();

  // 회원가입 폼
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // OTP 인증 폼
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const onSignUpSubmit = async (data: SignUpFormData) => {
    signUp({ email: data.email, password: data.password });
    setUserEmail(data.email);
    setConfirmationRequired(true);
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    verifyOtpCode({ email: userEmail, otp: data.otp });
    alert('회원가입이 완료되었습니다');
  };

  return (
    <main className="auth-form-layout">
      {confirmationRequired ? (
        <form
          className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4"
          onSubmit={otpForm.handleSubmit(onOtpSubmit)}
        >
          <p className="auth-form-title">인증 코드 입력</p>
          <Controller
            name="otp"
            control={otpForm.control}
            render={({ field }) => (
              <InputField
                {...field}
                id="otp"
                type="text"
                label="인증 코드"
                placeholder="6자리 인증 코드를 입력하세요"
                disabled={otpForm.formState.isSubmitting || verifyOtpPending}
                isError={otpForm.formState.errors.otp?.message}
              />
            )}
          />
          <Button
            type="submit"
            aria-label="인증 코드 확인 버튼"
            disabled={otpForm.formState.isSubmitting || verifyOtpPending}
            text='인증 코드 확인'
            customClassName="w-full"
          />
        </form>
      ) : (
        <form
          className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4"
          onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
        >
          <p className="auth-form-title">회원가입</p>
          <Controller
            name="email"
            control={signUpForm.control}
            render={({ field }) => (
              <InputField
                {...field}
                id="email"
                type="email"
                label="이메일"
                placeholder="아이디@주소"
                disabled={signUpForm.formState.isSubmitting || signUpPending}
                isError={signUpForm.formState.errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={signUpForm.control}
            render={({ field }) => (
              <InputField
                {...field}
                id="password"
                type="password"
                label="비밀번호"
                placeholder="********"
                disabled={signUpForm.formState.isSubmitting || signUpPending}
                isError={signUpForm.formState.errors.password?.message}
                isPasswordVisible={isPasswordVisible}
                handlePasswordVisibility={handlePasswordVisibility}
              />
            )}
          />

          <p>*비밀번호는 최소 6자 이상, 영문과 숫자를 포함해야 합니다.</p>
          <Button
            type="submit"
            aria-label="회원가입 요청 버튼"
            customClassName='bg-main'
            disabled={signUpForm.formState.isSubmitting || signUpPending}
            text='가입하기'
          />
          <Button
            type="button"
            aria-label="카카오 로그인 버튼"
            customClassName='bg-yellow-500'
            onClick={() => signinWithKakao()}
            text='카카오 로그인'
          />
          <p className="auth-form-mention">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/signin"
              aria-label="로그인 페이지로 이동 버튼"
              className="cursor-pointer"
            >
              <span className="font-bold text-main">로그인 하기</span>
            </Link>
          </p>
        </form>
      )}

    </main >
  );
}
