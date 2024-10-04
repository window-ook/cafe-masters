'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, Input, Button, Typography } from '@material-tailwind/react';
import { createBrowserSupabaseClient } from 'utils/supabase/client';

export default function Signup({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  const supabase = createBrowserSupabaseClient();

  const signupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:3000/signup/confirm',
        },
      });

      if (error) alert(error.message);

      if (data) setConfirmationRequired(true);
    },
  });

  return (
    <Card className="p-5 bg-white shadow-mainShadow">
      <Typography className="text-xl font-semibold">회원가입</Typography>
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
          loading={signupMutation.isPending}
          onClick={() => signupMutation.mutate()}
          disabled={confirmationRequired}
        >
          {confirmationRequired ? '전송된 인증 코드 확인' : '가입하기'}
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          이미 계정이 있으신가요?{' '}
          <Button
            onClick={() => setView('SIGNIN')}
            className="font-bold text-gray-900 shadow-none"
          >
            로그인하기
          </Button>
        </Typography>
      </form>
    </Card>
  );
}
