'use client';

import { Trophy, MessageCircle, RefreshCw, Smartphone } from 'lucide-react';
import React from 'react';
import { m } from 'motion/react';

interface IBenefitCard {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description1: string;
    description2: string;
    index: number;
}

const BenefitCard: React.FC<IBenefitCard> = ({ icon: Icon, title, description1, description2, index }) => {
    const getNeonColor = (idx: number) => {
        const colors = ['text-main', 'text-main-light', 'text-white'];
        return colors[idx % 2];
    };

    const neonColorClass = getNeonColor(index);
    const borderColorClass = index % 2 === 0 ? 'group-hover:border-main/50' : 'group-hover:border-white/50';

    return (
        <div className="group relative">
            {/* 배경 그라데이션 */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

            <div className={`relative flex h-full flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 ${borderColorClass}`}>
                <div className="mb-6 rounded-full bg-white/5 p-4 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10">
                    <Icon className={`size-8 ${neonColorClass} transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />
                </div>

                <h3 className="mb-4 text-xl font-bold text-white">
                    {title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300">
                    {description1}
                    <br />
                    {description2}
                </p>
            </div>
        </div>
    );
};

export default function BenefitsSection() {
    const benefits = [
        {
            icon: Trophy,
            title: '티어 시스템',
            description1: '수집한 카드가 늘어날 수록',
            description2: '티어가 상승합니다',
        },
        {
            icon: MessageCircle,
            title: '빠른 커뮤니티 지원',
            description1: '버그나 문의 사항을 남겨주세요',
            description2: '빠르게 확인하고 해결하겠습니다',
        },
        {
            icon: RefreshCw,
            title: '지속적인 업데이트',
            description1: '사용자를 위한 개선을 계속 업데이트 해요',
            description2: '항상 발전하는 서비스입니다',
        },
        {
            icon: Smartphone,
            title: '디바이스 프리',
            description1: 'PC, 모바일 어떤 환경이라도',
            description2: '편리하게 사용하세요',
        },
    ];

    return (
        <section className="relative overflow-hidden py-32 bg-transparent">
            <div className="relative mx-auto max-w-[1400px] px-6">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.5fr]">
                    {/* 왼쪽 텍스트 영역 */}
                    <div className="flex flex-col justify-center text-left">
                        <m.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="mb-8 text-4xl font-bold uppercase leading-tight text-white sm:text-5xl lg:text-6xl"
                        >
                            오직 <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-main-light">카페 마스터즈에서만</span>
                        </m.h2>
                        <m.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                            className="max-w-md text-lg text-gray-400"
                        >
                            카페 마스터즈는 단순한 기록을 넘어<br />
                            당신의 커피 라이프를 더 풍요롭게 만듭니다.
                        </m.p>
                    </div>

                    {/* 오른쪽 그리드 영역 */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {benefits.map((benefit, index) => (
                            <BenefitCard
                                key={index}
                                index={index}
                                icon={benefit.icon}
                                title={benefit.title}
                                description1={benefit.description1}
                                description2={benefit.description2}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
