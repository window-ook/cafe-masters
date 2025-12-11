'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignIn } from '@/hooks/supabase/authentication';
import { signInWithKakao } from '@/utils/supabase/signInWithKakao';
import { signInWithGoogle } from '@/utils/supabase/signInWithGoogle';
import { signInFormSchema, SignInFormData } from '@/schema/auth';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';

const ResetPasswordRequestForm = dynamic(() => import('@/components/signin/ResetPasswordRequestForm'), { ssr: false, loading: () => <div className='w-80 h-70 max-w-(--breakpoint-lg) sm:w-96 bg-white'></div> });

export default function SignInForm() {
  const [resetRequired, setResetRequired] = useState<boolean>(false);
  const [showResetForm, setShowResetForm] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const { signIn, isPending } = useSignIn();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);

  const onFormSubmit = async (data: SignInFormData) => {
    const trimmedEmail = data.email.trim();
    signIn({ email: trimmedEmail, password: data.password });
  };

  return (
    <main className="auth-form-layout">
      {showResetForm ? (
        <ResetPasswordRequestForm
          onBackAction={() => setShowResetForm(false)}
          onSuccessAction={() => {
            setShowResetForm(false);
            setResetRequired(true);
          }}
        />
      ) : !resetRequired ? (
        <div>
          <p className="auth-form-title">로그인</p>
          <form
            className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  id="email"
                  type="email"
                  label="이메일"
                  data-testid="email-input"
                  placeholder="아이디@주소"
                  disabled={isSubmitting || isPending}
                  isError={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  id="password"
                  type="password"
                  label="비밀번호"
                  data-testid="password-input"
                  placeholder="********"
                  disabled={isSubmitting || isPending}
                  isError={errors.password?.message}
                  isPasswordVisible={isPasswordVisible}
                  handlePasswordVisibility={togglePasswordVisibility}
                />
              )}
            />

            <Button
              type="submit"
              ariaLabel="로그인 버튼"
              dataTestId="button-signin"
              disabled={isSubmitting || isPending}
              text='접속하기'
            />
            <Button
              type="button"
              aria-label="비밀번호 재설정 폼 열기 버튼"
              dataTestId="open-resetpassword-form-button"
              onClick={() => setShowResetForm(true)}
              customClassName='bg-orange-500 hover:bg-orange-600'
              text='비밀번호 재설정'
            />
            <Button
              type="button"
              aria-label="구글 로그인 버튼"
              onClick={() => signInWithGoogle()}
              customClassName='bg-blue-500 hover:bg-blue-600'
              text='구글 로그인'
            />
            <Button
              type="button"
              aria-label="카카오 로그인 버튼"
              onClick={() => signInWithKakao()}
              customClassName="bg-yellow-500 hover:bg-yellow-600"
              text='카카오 로그인'
            />

            <p className="auth-form-mention">
              계정이 없으신가요?{' '}
              <Link
                href="/signup"
                aria-label="회원가입 페이지 이동 버튼"
                data-testid="button-go-to-signup-from-signin"
                className="cursor-pointer"
              >
                <span className="font-bold text-main">
                  회원가입
                </span>
              </Link>
            </p>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-main-light rounded-full flex items-center justify-center">
            <svg
              className="size-8 text-main"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">
              이메일을 확인해주세요
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-sm">
              비밀번호 재설정 링크를 이메일로 발송했습니다.<br />
              메일을 확인하고 링크를 클릭해주세요.
            </p>
          </div>

          <div className="space-y-3 flex flex-col items-center">
            <Button
              type="button"
              ariaLabel="로그인 화면으로 돌아가기"
              onClick={() => setResetRequired(false)}
              text='로그인 화면으로 돌아가기'
              customClassName='w-full'
            >
            </Button>
            <p className="text-sm text-gray-500 text-center">
              이메일이 오지 않았나요? 스팸도 확인해보세요.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}