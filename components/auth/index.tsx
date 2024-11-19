'use client';

import { useState } from 'react';
import Signup from './signup';
import Signin from './signin';
import AuthBackgroundCards from './auth-background-cards';
import LogoImage from './logo-image';

export default function Auth() {
  const [view, setView] = useState('SIGNIN');

  const checkEmailVaild = (email: string) => {
    const pattern =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return pattern.test(email);
  };

  return (
    <main className="area h-screen w-screen flex justify-center items-center">
      <AuthBackgroundCards />
      <div className="flex flex-col items-center gap-4">
        <LogoImage size={120} />
        {view === 'SIGNUP' ? (
          <Signup setView={setView} checkEmailVaild={checkEmailVaild} />
        ) : (
          <Signin setView={setView} checkEmailVaild={checkEmailVaild} />
        )}
      </div>
    </main>
  );
}
