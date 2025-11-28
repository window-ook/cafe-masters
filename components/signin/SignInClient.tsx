'use client';

import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import RisingCards from '@/components/shared/RisingCards';
import SignInForm from '@/components/signin/SignInForm';
import MainThemeBackground from '@/components/shared/MainThemeBackground';

export default function SignInClient() {
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
                        className="size-8"
                    />
                    <span className="text-3xl font-bold text-white [text-shadow:0_0_10px_rgba(135,90,173,1),0_4px_8px_rgba(0,0,0,0.9)]">
                        Cafe Masters
                    </span>
                </header>
                <SignInForm />
            </section>
        </main>
    );
} 