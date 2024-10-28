'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from 'utils/store';
import { signInWithKakao } from 'utils/supabase/signinKakao';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { Card, Button } from '@mui/material';
import UserForm from './user-form';
import ResetpasswordForm from './resetpassword-form';

export default function Signin({ setView, checkEmailVaild }: any) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [resetRequired, setResetRequired] = useState(false);
  const [resetRequested, setResetRequested] = useState('');
  const supabase = createBrowserSupabaseClient();
  const setUserId = useUserStore((state: any) => state.setUserId);
  const setUserEmail = useUserStore((state: any) => state.setUserEmail);

  const signinMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      if (data) {
        setUserId(data?.user?.id);
        setUserEmail(data?.user?.email?.split('@')?.[0]);
      }
    },

    onError: (error: Error) => {
      if (error.message === 'Invalid login credentials')
        alert('이메일 또는 비밀번호를 잘못 입력했습니다.');
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

  const handleSignIn = () => {
    if (checkEmail()) signinMutation.mutate();
  };

  return (
    <Card className="p-5 rounded-xl bg-white shadow-mainShadow z-10">
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
          <p className="text-center text-3xl font-bold font-dpixel">로그인</p>
          <form className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4">
            <UserForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
            />
            <span className="text-red-500">{emailError}</span>
            <Button
              aria-label="로그인 버튼"
              className="bg-main w-full hover:bg-opacity-70 hover:cursor-pointer"
              onClick={handleSignIn}
              disabled={signinMutation.isPending || password.length < 6}
              sx={{
                '&.Mui-disabled': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              <span className="font-dpixel text-white">접속하기</span>
            </Button>
            <Button
              aria-label="비밀번호 재설정 폼 열기 버튼"
              className="bg-blue-600 w-full hover:bg-opacity-70 hover:cursor-pointer"
              onClick={() => setResetRequired(true)}
            >
              <span className="font-dpixel text-white">비밀번호 재설정</span>
            </Button>
            <Button
              aria-label="카카오 로그인 버튼"
              className="bg-yellow-500 w-full hover:bg-opacity-70 hover:cursor-pointer"
              onClick={() => signInWithKakao()}
            >
              <span className="font-dpixel text-white">카카오 로그인</span>
            </Button>
            <span
              color="gray"
              className="flex items-center justify-center gap-4 text-center font-dpixel"
            >
              계정이 없으신가요?{' '}
              <Button
                aria-label="회원가입 폼 열기 버튼"
                onClick={() => setView('SIGNUP')}
                className="hover:cursor-pointer hover:bg-gray-100"
              >
                <span className="font-bold font-dpixel text-main">
                  회원가입
                </span>
              </Button>
            </span>
          </form>
        </div>
      )}
    </Card>
  );
}
