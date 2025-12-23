'use client';

import { IMAGE_PATHS } from '@/lib/paths';
import Image from 'next/image';
import SignInForm from '@/components/signin/SignInForm';
import Logo from '@/components/shared/sidebar/Logo';

export default function SignInClient() {
    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <section className="relative z-10 flex flex-col items-center gap-8 px-6">
                <header className="flex items-center">
                    <Image
                        src={IMAGE_PATHS.LOGO_IMG}
                        width={32}
                        height={32}
                        alt="로고 아이콘"
                        className="size-8"
                    />
                    <div className='flex items-center gap-1'>
                        <Logo />
                    </div>
                </header>
                <SignInForm />
            </section>
        </main>
    );
} 