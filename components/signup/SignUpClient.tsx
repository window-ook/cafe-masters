'use client';

import SignUpForm from '@/components/signup/SignUpForm';
import Logo from '@/components/shared/Logo';

export default function SignUpClient() {
  return (
    <main className="area flex h-screen w-screen items-center justify-center">
      <section className="relative z-10 flex flex-col items-center gap-8 px-6">
        <Logo />
        <SignUpForm />
      </section>
    </main>
  );
}
