'use client';

import { useAuthView } from 'config/auth-view-provider';
import Signup from '../signup';
import Signin from '../signin';
import AuthBackgroundCards from './background-cards';
import LogoImage from './logo-image';

export default function Auth() {
  const { view } = useAuthView();

  return (
    <main className="area h-screen w-screen flex justify-center items-center">
      <AuthBackgroundCards />
      <div className="flex flex-col items-center gap-4">
        <LogoImage size={100} />
        {view === 'SIGNUP' ? <Signup /> : <Signin />}
      </div>
    </main>
  );
}
