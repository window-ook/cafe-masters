'use client';

import { useState } from 'react';
import Signup from './signup';
import SignIn from './signin';

export default function Auth() {
  const [view, setView] = useState('SIGNUP');

  return (
    <main className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-main to-light-blue-50">
      {view === 'SIGNUP' ? (
        <Signup setView={setView} />
      ) : (
        <SignIn setView={setView} />
      )}
    </main>
  );
}
