'use client';

import { useState } from 'react';
import Signup from 'components/auth/signup/index';
import Signin from 'components/auth/signin/index';
import AuthBackgroundCards from 'components/auth/shared/background-cards';
import Image from 'next/image';

export type AuthView = 'SIGNIN' | 'SIGNUP';

export interface SignProps {
  setViewAction: (view: AuthView) => void;
}

export default function Auth() {
  const [view, setViewAction] = useState<AuthView>('SIGNIN');

  return (
    <main className="area h-screen w-screen flex justify-center items-center">
      <AuthBackgroundCards />
      <section className="flex flex-col items-center gap-4">
        <header className="flex">
          <Image
            src="/image/logo.avif"
            width={100}
            height={100}
            alt="로고 아이콘"
            className="w-[2rem] h-auto"
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
  );
}
