import { CakeSlice, PiggyBank, MicOff, Plug, SquareParking, Smile } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

interface ICategoryCard {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

const CATEGORIES = [
    {
        title: '커피가 맛있는',
        description: '커피가 맛있는 카페들이에요',
        icon: Smile,
    },
    {
        title: '디저트가 맛있는',
        description: '디저트가 맛있는 카페들이에요',
        icon: CakeSlice,
    },
    {
        title: '가격이 합리적인',
        description: '가성비가 좋은 가격대의 카페들이에요',
        icon: PiggyBank,
    },
    {
        title: '조용한',
        description: '조용한 분위기의 카페들이에요',
        icon: MicOff,
    },
    {
        title: '콘센트 많은',
        description: '콘센트가 많아서 노트북 편하게 하기 좋아요',
        icon: Plug,
    },
    {
        title: '주차장 있는',
        description: '주차장이 있어서 차를 타고 가기 좋아요',
        icon: SquareParking,
    },
];

const CategoryCard = ({ icon: Icon, title, description }: ICategoryCard) => {
    return (
        <div className="group relative cursor-pointer" >
            {/* Backlight Effect */}
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-main/20 via-purple-300/20 to-main/20 opacity-0 blur transition duration-1000 group-hover:opacity-100" />

            {/* Main Card */}
            <div className="relative rounded-xl border border-white/40 bg-white/50 p-6 shadow-xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-main/20 to-main/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-main/30">
                        <Icon className="h-6 w-6 text-main transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-main">
                        {title}
                    </h3>
                </div>
                <p className="leading-relaxed text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    );
};

CategoryCard.displayName = 'CategoryCard';

export default function CategorySection() {
    return (
        <section className="relative overflow-hidden py-20">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

            {/* Blur Elements */}
            <div className="absolute right-10 top-10 h-80 w-80 animate-pulse rounded-full bg-main/10 blur-3xl" />
            <div className="absolute bottom-10 left-10 h-64 w-64 animate-pulse rounded-full bg-purple-200/30 blur-3xl delay-500" />

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-2xl sm:text-4xl font-bold text-gray-900">
                        카테고리로 편하게 카페 찾기
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-xl text-gray-600">
                        원하는 분위기와 목적에 맞는 카페를 <br className='block sm:hidden' />카테고리별로 쉽게 찾아보세요
                    </p>
                    <p className="mx-auto max-w-2xl text-sm sm:text-xl text-gray-600">
                        여러분이 수집한 카드에도 <br className='block sm:hidden' />카테고리를 등록해서 확인할 수 있어요
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {CATEGORIES.map((category, index) => (
                        <CategoryCard
                            key={index}
                            icon={category.icon}
                            title={category.title}
                            description={category.description}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="group relative inline-block">
                        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-main/20 via-purple-300/20 to-main/20 opacity-0 blur transition duration-1000 group-hover:opacity-100" />
                        <Link
                            href="/recommendation"
                            className="relative inline-block rounded-xl bg-main px-8 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-main-dark"
                        >
                            모든 카테고리 보기
                        </Link>
                    </div>
                </div>
            </div>
        </section >
    );
};

CategorySection.displayName = 'CategorySection';