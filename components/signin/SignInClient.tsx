'use client';

import SignInForm from '@/components/signin/SignInForm';
import Logo from '@/components/shared/Logo';

export default function SignInClient() {
  return (
    <main className="area flex h-screen w-screen items-center justify-center">
      <section className="relative z-10 flex flex-col items-center gap-8 px-6">
        <Logo />
        <SignInForm />
      </section>
    </main>
  );
}
