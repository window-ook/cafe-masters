'use client';

import { useState } from 'react';
import Signup from './signup';
import Signin from './signin';
import Image from 'next/image';
import AuthBackgroundCards from './auth-background-cards';

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
        <Image
          alt="텍스트 로고"
          src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/logo_text.webp"
          width={180}
          height={180}
          className="w-auto h-auto"
        />
        {view === 'SIGNUP' ? (
          <Signup setView={setView} checkEmailVaild={checkEmailVaild} />
        ) : (
          <Signin setView={setView} checkEmailVaild={checkEmailVaild} />
        )}
      </div>
    </main>
  );
}
