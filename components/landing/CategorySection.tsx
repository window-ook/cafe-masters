'use client';

import { CakeSlice, PiggyBank, MicOff, Plug, SquareParking, Smile } from 'lucide-react';
import { m } from 'motion/react';

const CATEGORIES = [
    {
        title: '커피가 맛있는',
        description: '커피 본연의 맛을 즐길 수 있는 카페',
        icon: Smile,
    },
    {
        title: '디저트가 맛있는',
        description: '달콤한 디저트가 가득한 카페',
        icon: CakeSlice,
    },
    {
        title: '가격이 합리적인',
        description: '부담 없는 가격으로 즐기는 카페',
        icon: PiggyBank,
    },
    {
        title: '조용한',
        description: '집중하기 좋은 차분한 분위기',
        icon: MicOff,
    },
    {
        title: '콘센트 많은',
        description: '노트북 작업하기 최적의 장소',
        icon: Plug,
    },
    {
        title: '주차장 있는',
        description: '드라이브와 함께하기 좋은 카페',
        icon: SquareParking,
    },
];

export default function CategorySection() {
    return (
        <section className="relative overflow-hidden py-32 bg-transparent">
            <div className="relative mx-auto max-w-[1400px] px-6">
                {/* 섹션 헤더 */}
                <div className="mb-20 text-center">
                    <m.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl"
                    >
                        다양한 <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-main-light">카테고리</span>
                    </m.h2>
                    <m.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                        className="mt-4 text-lg text-gray-400"
                    >
                        원하는 분위기와 목적에 맞는 카페를 쉽게 찾아보세요.
                    </m.p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {CATEGORIES.map((category, index) => (
                        <div
                            key={index}
                            className="group relative"
                        >
                            {/* 백라이트 효과 */}
                            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-main/20 to-main-light/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="relative h-full rounded-xl border border-white/10 bg-black/40 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/5">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-main group-hover:bg-main/10 group-hover:shadow-[0_0_15px_rgba(218,72,59,0.3)] transition-all duration-300">
                                        <category.icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 group-hover:text-main transition-colors">0{index + 1}</span>
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-white group-hover:text-main transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
