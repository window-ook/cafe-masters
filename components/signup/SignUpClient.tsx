'use client';

import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import SignUpForm from '@/components/signup/SignUpForm';

export default function SignUpClient() {
    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <section className="relative z-10 flex flex-col items-center gap-4">
                <header className="flex items-center">
                    <Image
                        src={IMAGE_PATHS.LOGO_IMG}
                        width={32}
                        height={32}
                        alt="로고 아이콘"
                        className="size-8"
                    />
                    <span className="text-3xl font-bold text-white [text-shadow:0_0_10px_rgba(135,90,173,1),0_4px_8px_rgba(0,0,0,0.9)]">
                        Cafe Masters
                    </span>
                </header>
                <div className="auth-form-layout">
                    <SignUpForm />
                </div>
            </section>
        </main>
    );
}