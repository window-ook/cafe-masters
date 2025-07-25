'use client';

import FallingCards from '@/components/shared/FallingCards';
import Image from 'next/image';
import SignUpForm from '@/components/signup/SignUpForm';

export default function SignUpPageClient() {
    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <FallingCards />
            <section className="flex flex-col items-center gap-4">
                <header className="flex">
                    <Image
                        src="/image/logo.avif"
                        width={100}
                        height={100}
                        alt="로고 아이콘"
                        className="w-8 h-auto"
                    />
                    <span className="text-3xl text-white text-shadow-black font-pretendard font-bold">
                        Cafe Masters
                    </span>
                </header>
                <SignUpForm />
            </section>
        </main>
    );
} 