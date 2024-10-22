'use client';

import { useState } from 'react';
import Signup from './signup';
import SignIn from './signin';
import Image from 'next/image';

export default function Auth() {
  const [view, setView] = useState('SIGNIN');

  return (
    <main className="area h-screen w-screen flex justify-center items-center">
      {/* 상승하는 카드 */}
      <ul className="circles z-0">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="flex flex-col items-center gap-4">
        <Image
          alt="텍스트 로고"
          src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/logo_text.webp"
          width={200}
          height={200}
        />
        {view === 'SIGNUP' ? (
          <Signup setView={setView} />
        ) : (
          <SignIn setView={setView} />
        )}
      </div>
    </main>
  );
}
