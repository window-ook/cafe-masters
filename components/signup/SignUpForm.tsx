'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@/hooks/supabase/authentication';
import { signInWithGoogle } from '@/utils/supabase/signInWithGoogle';
import { signInWithKakao } from '@/utils/supabase/signInWithKakao';
import { signUpFormSchema, SignUpFormData } from '@/schema/auth';
import Link from 'next/link';
import { CircleX } from 'lucide-react';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';

export default function SignUpEmailForm() {
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const { signUp, signUpPending } = useSignUp();

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handlePasswordVisibility = () => setIsPasswordVisible(prev => !prev);
  const handleClose = () => router.push('/');

  const onSignUpSubmit = async (data: SignUpFormData) => {
    signUp({ email: data.email, password: data.password }, {
      onSuccess: () => {
        sessionStorage.setItem('signup_email', data.email);
        router.push('/signup/verify');
      },
      // 에러는 이미 useSignUp 훅에서 toast로 처리. 추가 처리가 필요한 경우에만 onError 추가
    });
  };

  return (
    <div className="auth-glass-card">
      <form
        className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4"
        onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
      >
        <div className="flex justify-between items-center mb-4">
          <p className="auth-form-title">회원가입</p>
        <button
          type="button"
          aria-label="회원가입 취소 버튼"
          onClick={handleClose}
          className='cursor-pointer hover:opacity-60 transition-opacity'
        >
          <CircleX className='size-8' />
        </button>
      </div>
      <Controller
        name="email"
        control={signUpForm.control}
        render={({ field }) => (
          <InputField
            {...field}
            id="email"
            type="email"
            label="이메일"
            data-testid="email-input"
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
            data-testid="password-input"
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
        dataTestId="button-submit-request-signup"
        disabled={signUpForm.formState.isSubmitting || signUpPending}
        customClassName='bg-main'
        text='가입하기'
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
        customClassName='bg-yellow-500 hover:bg-yellow-600'
        text='카카오 로그인'
      />

      <p className="auth-form-mention">
        이미 계정이 있으신가요?{' '}
        <Link
          href="/signin"
          aria-label="로그인 페이지 이동 버튼"
          data-testid="button-go-to-signin-from-signup"
          className="cursor-pointer"
        >
          <span className="font-bold text-main">로그인 하기</span>
        </Link>
      </p>
      </form>
    </div>
  );
}