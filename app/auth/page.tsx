'use client';

import { useState } from 'react';
import Head from 'next/head';
import Signin from 'components/auth/signin/index';
import BackgroundCards from 'components/auth/shared/background-cards';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Signup = dynamic(() => import('components/auth/signup/index'), {
  ssr: false,
});

export type AuthView = 'SIGNIN' | 'SIGNUP';

export interface SignProps {
  setViewAction: (view: AuthView) => void;
}

export default function Auth() {
  const [view, setViewAction] = useState<AuthView>('SIGNIN');

  return (
    <>
      <Head>
        <title>로그인 | Cafe Masters</title>
        <meta name="description" content={`로그인 페이지입니다.`} />
      </Head>
      <main className="area h-screen w-screen flex justify-center items-center">
        <BackgroundCards />
        <section className="flex flex-col items-center gap-4">
          <header className="flex">
            <Image
              src="/image/logo.avif"
              width={100}
              height={100}
              alt="로고 아이콘"
              className="w-8 h-auto"
            />
            <span className="text-3xl text-white text-shadow-black font-pretendard font-bold">
              Cafe Masters
            </span>
          </header>
          {view === 'SIGNUP' ? (
            <Signup setViewAction={setViewAction} />
          ) : (
            <Signin setViewAction={setViewAction} />
          )}
        </section>
      </main>
    </>
  );
}
