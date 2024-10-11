'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, Button, Typography } from '@material-tailwind/react';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { signInWithKakao } from 'utils/supabase/signinKakao';
import UserForm from './user-form';
import { useUserStore } from 'utils/store';

export default function SignIn({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createBrowserSupabaseClient();
  const setUserId = useUserStore((state) => state.setUserId);

  const signinMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) alert(error.message);

      if (data) {
        setUserId(data?.user?.id);
      }
    },
  });

  return (
    <Card className="p-5 bg-white shadow-mainShadow">
      <Typography className="text-xl font-semibold">로그인</Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <UserForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
        />
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
