'use client';

import SignInForm from '@/components/signin/SignInForm';
import Logo from '@/components/shared/sidebar/Logo';

export default function SignInClient() {
    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <section className="relative z-10 flex flex-col items-center gap-8 px-6">
                <Logo />
                <SignInForm />
            </section>
        </main>
    );
} 