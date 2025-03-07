'use client';

import { useState } from 'react';
import Signup from 'components/auth/signup/index';
import Signin from 'components/auth/signin/index';
import AuthBackgroundCards from 'components/auth/shared/background-cards';
import LogoImage from 'components/auth/shared/logo-image';

export type AuthView = 'SIGNIN' | 'SIGNUP';

export interface SignProps {
  setViewAction: (view: AuthView) => void;
}

export default function Auth() {
  const [view, setViewAction] = useState<AuthView>('SIGNIN');

  return (
    <main className="area h-screen w-screen flex justify-center items-center">
      <AuthBackgroundCards />
      <div className="flex flex-col items-center gap-4">
        <LogoImage size={100} />
        {view === 'SIGNUP' ? (
          <Signup setViewAction={setViewAction} />
        ) : (
          <Signin setViewAction={setViewAction} />
        )}
      </div>
    </main>
  );
}
