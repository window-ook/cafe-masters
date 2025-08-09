import React from 'react';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="relative overflow-hidden py-20">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-main to-main-dark" />

            {/* Blur Elements */}
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

                    {/* Main Button */}
                    <Link
                        href="/signin"
                        className="relative inline-block rounded-xl bg-white px-12 sm:px-8 py-4 sm:text-xl font-bold text-main shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-2xl"
                    >
                        지금 시작하기
                    </Link>
                </div>
            </div>
        </section>
    );
}