'use client';

import { EXTERNAL_PATHS } from '@/lib/paths';
import { ExternalLink, MessageSquareText } from 'lucide-react';
import React from 'react';

interface ICheckCard {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
}

const CheckCard = ({ title, description, icon: Icon, onClick }: ICheckCard) => {
    return (
        <button
            type="button"
            aria-label={`${title} 버튼`}
            onClick={onClick}
            className="group relative w-[50%]">
            {/* 백라이트 */}
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-main/20 via-purple-300/20 to-main/20 opacity-0 blur transition duration-1000 group-hover:opacity-100" />

            {/* 카드 내용 */}
            <div className="relative flex h-40 cursor-pointer flex-col justify-center rounded-xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between">
                    <span className="font-bold text-white text-xs sm:text-xl">
                        {title}
                    </span>
                    <div className="hidden sm:block text-white transition-transform duration-300 group-hover:scale-110">
                        <Icon className="size-4 sm:size-6 text-white" />
                    </div>
                </div>
                <span className="text-left font-bold text-main-light text-xs sm:text-xl transition-colors duration-300 hover:text-gray-200">
                    {description}
                </span>
            </div>
        </button>
    );
};

CheckCard.displayName = 'CheckCard';

export default function CheckSection() {
    const handleGuideLinkClick = () => window.open(EXTERNAL_PATHS.USER_MANUAL, '_blank');
    const handleFeedbackClick = () => window.open(EXTERNAL_PATHS.GOOGLE_FORM_FEEDBACK, '_blank');

    return (
        <section className="relative w-full overflow-hidden py-32">
            {/* 배경 */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

            {/* 체크 섹션 */}
            <div className="absolute left-1/4 top-10 h-64 w-64 animate-pulse rounded-full bg-main/10 blur-3xl" />
            <div className="absolute bottom-10 right-1/4 h-80 w-80 animate-pulse rounded-full bg-purple-200/10 blur-3xl delay-500" />

            <div className="relative">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-10 transition-all duration-1000 ease-out sm:px-16 md:px-20 lg:px-24 xl:px-32">
                    <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-2xl sm:text-5xl font-bold text-transparent">
                        Please Check<span className="ml-2 text-main">✓</span>
                    </span>

                    <div className="flex justify-between gap-6">
                        <CheckCard
                            title="카페 마스터즈 사용법"
                            description="어떻게 사용하는지 쉽게 소개해드려요"
                            icon={ExternalLink}
                            onClick={handleGuideLinkClick}
                        />
                        <CheckCard
                            title="피드백을 들려주세요"
                            description="서비스 개선에 큰 힘이 됩니다"
                            icon={MessageSquareText}
                            onClick={handleFeedbackClick}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}