'use client';

import { FolderCheck, Bookmark, Target } from 'lucide-react';
import React from 'react';
import { m } from 'motion/react';

interface IFeatureCard {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description1: string;
    description2: string;
    category: string;
    index: number;
}

const FeatureCard = ({ icon: Icon, title, description1, description2, category, index }: IFeatureCard) => {
    return (
        <div
            className="group relative h-full"
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* 백라이트 */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-main/30 via-main-light/30 to-main/30 opacity-0 blur-xl transition duration-500 group-hover:opacity-70" />

            {/* 카드 내용 */}
            <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 group-hover:border-white/20">
                <div>
                    <div className="mb-6 flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-main transition-transform duration-300 group-hover:scale-110 group-hover:bg-main/10 group-hover:shadow-[0_0_20px_rgba(218,72,59,0.3)]">
                            <Icon className="size-7" />
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60">
                            {category}
                        </span>
                    </div>

                    <h3 className="mb-4 text-2xl font-bold text-white transition-colors group-hover:text-main">
                        {title}
                    </h3>

                    <div className="space-y-1">
                        <p className="leading-relaxed text-gray-400 group-hover:text-gray-300">
                            {description1}
                        </p>
                        <p className="leading-relaxed text-gray-400 group-hover:text-gray-300">
                            {description2}
                        </p>
                    </div>
                </div>

                {/* 하단 데코레이션 */}
                <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-0 bg-gradient-to-r from-main to-main-light transition-all duration-700 ease-out group-hover:w-full" />
                </div>
            </div>
        </div>
    );
};

export default function FeatureSection() {
    const features = [
        {
            id: 1,
            icon: FolderCheck,
            title: '카페 수집',
            category: 'COLLECTION',
            description1: '방문했던 카페 수집하세요',
            description2: '나만의 카드 컬렉션으로',
        },
        {
            id: 2,
            icon: Bookmark,
            title: '북마크 하기',
            category: 'BOOKMARK',
            description1: '까먹지 않게 해드려요',
            description2: '클릭하고 언제든지 쉽게 찾아보세요',
        },
        {
            id: 3,
            icon: Target,
            title: '추천 리스트',
            category: 'CURATION',
            description1: '제가 직접 가보고 추천하는 카페입니다',
            description2: '호불호 없는 곳으로 콕 찝어드립니다',
        },
    ];

    return (
        <section className="relative overflow-hidden py-32 bg-transparent">
            <div className="relative mx-auto max-w-[1400px] px-6">
                {/* 섹션 헤더 */}
                <div className="mb-20">
                    <m.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="text-right text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-main via-main-light to-white">쉽고 편하게</span>
                    </m.h2>
                </div>

                {/* 그리드 */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.id}
                            index={index}
                            category={feature.category}
                            icon={feature.icon}
                            title={feature.title}
                            description1={feature.description1}
                            description2={feature.description2}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
