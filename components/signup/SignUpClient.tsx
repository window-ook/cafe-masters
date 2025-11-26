'use client';

import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import RisingCards from '@/components/shared/RisingCards';
import SignUpForm from '@/components/signup/SignUpForm';
import MainThemeBackground from '@/components/shared/MainThemeBackground';

export default function SignUpClient() {
    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <MainThemeBackground />
            <RisingCards />
            <section className="relative z-10 flex flex-col items-center gap-4">
                <header className="flex items-center">
                    <Image
                        src={IMAGE_PATHS.RISING_CARDS_BACKGROUND}
                        width={32}
                        height={32}
                        alt="로고 아이콘"
                        className="w-8 h-8"
                    />
                    <span className="text-3xl text-white text-shadow-black font-bold">
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