'use client';

import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import FallingCards from '@/components/shared/FallingCards';
import SignUpEmailForm from '@/components/signup/SignUpEmailForm';
import MainThemeBackground from '@/components/shared/MainThemeBackground';

export default function SignUpPageClient() {
    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <MainThemeBackground />
            <FallingCards />
            <section className="relative z-10 flex flex-col items-center gap-4">
                <header className="flex">
                    <Image
                        src={IMAGE_PATHS.FALLING_CARDS_BACKGROUND}
                        width={100}
                        height={100}
                        alt="로고 아이콘"
                        className="w-8 h-auto"
                    />
                    <span className="text-3xl text-white text-shadow-black font-bold">
                        Cafe Masters
                    </span>
                </header>
                <div className="auth-form-layout">
                    <SignUpEmailForm />
                </div>
            </section>
        </main>
    );
}