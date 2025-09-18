import React from 'react';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="relative overflow-hidden py-20">
            {/* 배경 */}
            <div className="absolute inset-0 bg-gradient-to-r from-main to-main-dark" />

            {/* 블러 */}
            <div className="absolute left-10 top-10 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-80 w-80 animate-pulse rounded-full bg-purple-200/20 blur-3xl delay-500" />

            <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
                <h2 className="mb-6 text-2xl sm:text-5xl font-bold">
                    마스터가 될 준비가 되셨나요?
                </h2>

                <p className="mb-8 text-sm sm:text-xl leading-relaxed text-main-super-light">
                    지금 시작해서 나만의 카페 컬렉션을 만들고,
                    <br />
                    새로운 카페 경험의 세계로 떠나보세요.
                </p>

                <div className="group relative inline-block">
                    {/* Backlight Effect */}
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-white/30 via-purple-300/30 to-white/30 opacity-0 blur transition duration-1000 group-hover:opacity-100" />

                    {/* Main Button Container */}
                    <div className='relative flex rounded-xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden'>
                        {/* 카페 찾기 Link */}
                        <Link
                            href="/main"
                            className="group/cafe w-32 sm:w-40 px-6 sm:px-16 py-4 sm:text-xl font-bold text-main transition-all duration-300 hover:bg-gray-300 hover:text-main flex items-center justify-center text-nowrap"
                        >
                            카페 찾기
                        </Link>

                        {/* 수직 구분선 */}
                        <div className='w-0.5 bg-gray-300'></div>

                        {/* 로그인/회원가입 Link */}
                        <Link
                            href="/signin"
                            className="group/cafe w-32 sm:w-40 px-6 sm:px-16 py-4 sm:text-xl font-bold text-main transition-all duration-300 hover:bg-gray-300 hover:text-main flex items-center justify-center text-nowrap"
                        >
                            로그인
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}