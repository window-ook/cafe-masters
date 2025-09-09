'use client';

import React, { useState, useRef } from 'react';
import { Sticker, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface ISampleCard {
    id: number;
    title: string;
    stars: number;
    description1: string;
    description2: string;
    gradient: string;
    iconColor: string;
}

const SAMPLE_CARDS: ISampleCard[] = [
    {
        id: 1,
        title: '반갑습니다 사용자님!',
        stars: 8,
        description1: '카드를 많이 수집해서',
        description2: '카페 마스터가 되세요!',
        gradient: 'from-[#B5582D] via-[#C28D65] to-[#C59066]',
        iconColor: 'text-orange-800'
    },
    {
        id: 2,
        title: '다양한 카페를 탐험하세요!',
        stars: 6,
        description1: '숨겨진 카페들을',
        description2: '발견해보세요!',
        gradient: 'from-emerald-600 via-emerald-400 to-emerald-500',
        iconColor: 'text-emerald-900'
    },
    {
        id: 3,
        title: '친구들과 함께 즐기세요!',
        stars: 7,
        description1: '북마크를 공유하고',
        description2: '추천을 나누세요!',
        gradient: 'from-purple-600 via-purple-400 to-purple-500',
        iconColor: 'text-purple-900'
    }
];

const getCardStyles = (position: string) => {
    const baseClasses = 'absolute top-0 w-full h-full transition-all duration-500 ease-in-out';

    switch (position) {
        case 'center':
            return `${baseClasses} left-0 opacity-100 scale-100 z-20`;
        case 'left':
            return `${baseClasses} -left-24 opacity-30 scale-75 z-10`;
        case 'right':
            return `${baseClasses} left-24 opacity-30 scale-75 z-10`;
        default:
            return `${baseClasses} opacity-0 scale-50 z-0`;
    }
};

export default function SampleCards() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);

    const handleCardMouseMove = (e: React.MouseEvent) => {
        const container = cardRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.nativeEvent.clientX - rect.left;
        const y = e.nativeEvent.clientY - rect.top;
        const rotateY = (x / rect.width - 0.5) * -30;
        const rotateX = (y / rect.height - 0.5) * 30;

        container.style.setProperty('--rotate-x', `${rotateX}deg`);
        container.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    const handleCardMouseLeave = () => {
        const container = cardRef.current;
        if (!container) return;

        container.style.setProperty('--rotate-x', `0deg`);
        container.style.setProperty('--rotate-y', `0deg`);
    };

    const goToPrevious = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prevIndex) => prevIndex === 0 ? SAMPLE_CARDS.length - 1 : prevIndex - 1);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const goToNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prevIndex) => prevIndex === SAMPLE_CARDS.length - 1 ? 0 : prevIndex + 1);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const getCardPosition = (index: number) => {
        const diff = (index - currentIndex + SAMPLE_CARDS.length) % SAMPLE_CARDS.length;

        if (diff === 0) return 'center';
        if (diff === 1 || diff === -(SAMPLE_CARDS.length - 1)) return 'right';
        if (diff === SAMPLE_CARDS.length - 1 || diff === -1) return 'left';
        return 'hidden';
    };

    return (
        <div className="relative w-full max-w-md mx-auto h-96 flex items-center justify-center">
            {/* 좌측 화살표 */}
            <button
                onClick={goToPrevious}
                disabled={isAnimating}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg hover:bg-white/30 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* 카드 컨테이너 */}
            <div className="relative w-80 h-96">
                {SAMPLE_CARDS.map((card, index) => {
                    const position = getCardPosition(index);
                    const isCenter = position === 'center';

                    return (
                        <div
                            key={card.id}
                            className={`${getCardStyles(position)} card-container`}
                        >
                            <div
                                ref={isCenter ? cardRef : null}
                                onMouseMove={isCenter ? handleCardMouseMove : undefined}
                                onMouseLeave={isCenter ? handleCardMouseLeave : undefined}
                                className={`${isCenter ? 'card-tilt' : ''} card-sample w-full h-full p-4 border-6 rounded-2xl drop-shadow-3xl bg-gradient-to-br ${card.gradient} border-gray-500 flex flex-col justify-between cursor-pointer`}
                            >
                                {/* 카페 이름 */}
                                <div className="flex flex-col gap-2">
                                    <p className="whitespace-nowrap overflow-hidden text-left text-ellipsis font-dunggeunmo font-bold text-lg text-white">
                                        {card.title}
                                    </p>
                                    {/* 별점 */}
                                    <div className="flex justify-start gap-0.5">
                                        {Array(card.stars)
                                            .fill(0)
                                            .map((_, starIndex) => (
                                                <div key={starIndex} className="rating-red-circle">
                                                    <Star className="fill-rating-star text-rating-star size-3" />
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* 썸네일 */}
                                <div className="z-10 h-24 bg-gray-700 rounded-lg flex flex-col">
                                    <div className="h-40 w-full bg-gradient-to-br from-orange-200 to-orange-400 rounded-t-md flex items-center justify-center">
                                        <Sticker className={`h-12 w-12 ${card.iconColor}`} />
                                    </div>
                                    <div className="h-4 w-full bg-white rounded-b-md flex items-center justify-center">
                                        <span className="text-xs text-black">CAFE MASTERS</span>
                                    </div>
                                </div>

                                {/* 디스크립션 */}
                                <div className="relative z-10 px-2 rounded-md border-[0.125rem] border-gray-500 bg-[#E8CEB7] flex flex-col">
                                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 size-1.5 border-gray-600 bg-gray-500 border" />
                                    <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 size-1.5 border-gray-600 bg-gray-500 border" />
                                    <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 size-1.5 border-gray-600 bg-gray-500 border" />
                                    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 size-1.5 border-gray-600 bg-gray-500 border" />
                                    <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-gray-600">
                                        {card.description1}
                                    </p>
                                    <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-gray-600">
                                        {card.description2}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 우측 화살표 */}
            <button
                onClick={goToNext}
                disabled={isAnimating}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg hover:bg-white/30 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>
        </div>
    );
}

