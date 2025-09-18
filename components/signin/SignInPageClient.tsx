'use client';

import { IMAGE_PATHS } from '@/lib/paths';
import FallingCards from '@/components/shared/FallingCards';
import Image from 'next/image';
import SignInForm from '@/components/signin/SignInForm';

export default function SignInPageClient() {
    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-main-900 to-green-900" />
            <div className="absolute -left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-main/30 blur-3xl" />
            <div className="absolute -right-20 bottom-20 h-96 w-96 animate-pulse rounded-full bg-purple-200/50 blur-3xl delay-1000" />
            <div className="absolute left-1/2 top-1/3 h-64 w-64 animate-pulse rounded-full bg-main-light/20 blur-3xl delay-500" />
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
                <SignInForm />
            </section>
        </main>
    );
} 