'use client';

import SignUpForm from '@/components/signup/SignUpForm';
import Logo from '@/components/shared/sidebar/Logo';

export default function SignUpClient() {
    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <section className="relative z-10 flex flex-col items-center gap-8 px-6">
                <Logo />
                <SignUpForm />
            </section>
        </main>
    );
}