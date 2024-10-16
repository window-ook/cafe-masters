'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from 'utils/store';
import { signInWithKakao } from 'utils/supabase/signinKakao';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { Card, Button, Typography } from '@mui/material';
import UserForm from './user-form';

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
        setUserId(data?.user?.id); // uuid
      }
    },
  });

  return (
    <Card className="p-5 rounded-xl bg-white shadow-mainShadow">
      <Typography className="text-center text-3xl font-bold font-dpixel">
        로그인
      </Typography>
      <form className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4">
        <UserForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
        />
        <Button
          className="bg-main font-dpixel text-white hover:bg-opacity-70"
          fullWidth
          onClick={() => {
            signinMutation.mutate();
          }}
          onLoad={signinMutation.isPending}
          disabled={signinMutation.isPending}
        >
          접속하기
        </Button>
        <Button
          className="bg-yellow-500 font-dpixel text-white hover:bg-opacity-70"
          fullWidth
          onClick={() => signInWithKakao()}
        >
          카카오 로그인
        </Button>
        <Typography
          color="gray"
          className="text-center font-dpixel flex items-center justify-center"
        >
          계정이 없으신가요?{' '}
          <Button onClick={() => setView('SIGNUP')}>
            <span className="font-bold font-dpixel">회원가입</span>
          </Button>
        </Typography>
      </form>
    </Card>
  );
}
