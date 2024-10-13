'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, Input, Button, Typography, TextField } from '@mui/material';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { signInWithKakao } from 'utils/supabase/signinKakao';
import UserForm from './user-form';

export default function Signup({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
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

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.verifyOtp({
        type: 'signup',
        email,
        token: otp,
      });

      if (error) alert(error.message);

      if (data) setConfirmationRequired(true);
    },
  });

  return (
    <Card className="p-5 rounded-xl bg-white shadow-mainShadow">
      <Typography className="text-center text-3xl font-bold font-dpixel">
        회원가입
      </Typography>
      <form className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4">
        {confirmationRequired ? (
          <div className="flex flex-col gap-6">
            <Typography className="text-xl font-dpixel">인증 코드</Typography>
            <TextField
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              label="6자리 인증 코드를 입력하세요"
              variant="outlined"
              type="text"
              className="p-2"
            />
          </div>
        ) : (
          <UserForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        )}
        <Button
          className="bg-main font-dpixel text-white hover:bg-opacity-70"
          fullWidth
          onClick={() => {
            if (confirmationRequired) verifyOtpMutation.mutate();
            else signupMutation.mutate();
          }}
          onLoad={
            confirmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
          disabled={
            confirmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
        >
          {confirmationRequired ? '인증 코드 확인' : '가입하기'}
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
          이미 계정이 있으신가요?{' '}
          <Button
            onClick={() => setView('SIGNIN')}
            className="font-bold font-dpixel"
          >
            로그인하기
          </Button>
        </Typography>
      </form>
    </Card>
  );
}
