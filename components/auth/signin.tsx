'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, Input, Button, Typography } from '@material-tailwind/react';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { signInWithKakao } from 'utils/supabase/signinKakao';

export default function SignIn({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createBrowserSupabaseClient();

  const signinMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) alert(error.message);

      if (data) console.log(data);
    },
  });

  // const signInWithKakao = async () => {
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: 'kakao',
  //     options: {
  //       redirectTo: process.env.NEXT_PUBLIC_API_REQUEST_URI
  //         ? `https://${process.env.NEXT_PUBLIC_API_REQUEST_URI}/auth/callback`
  //         : 'http://localhost:3000/auth/callback',
  //     },
  //   });

  //   if (error) alert(error.message);

  //   if (data) console.log(data);
  // };

  return (
    <Card className="p-5 bg-white shadow-mainShadow">
      <Typography className="text-xl font-semibold">로그인</Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography className="-mb-3 text-lg">이메일</Typography>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            placeholder="아이디@주소"
            className="border-gray-400 active:border-main p-2"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
          />
          <Typography className="-mb-3 text-lg">비밀번호</Typography>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            size="lg"
            placeholder="********"
            className="border-gray-400 active:border-main p-2"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
          />
        </div>
        <Button
          className="mt-6 bg-main"
          fullWidth
          onClick={() => {
            signinMutation.mutate();
          }}
          loading={signinMutation.isPending}
          disabled={signinMutation.isPending}
        >
          접속하기
        </Button>
        <Button
          className="mt-6 bg-yellow-700"
          fullWidth
          onClick={() => {
            signInWithKakao();
          }}
        >
          카카오 로그인
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          계정이 없으신가요?{' '}
          <Button
            onClick={() => setView('SIGNUP')}
            className="font-bold text-gray-900 shadow-none"
          >
            회원가입하기
          </Button>
        </Typography>
      </form>
    </Card>
  );
}
