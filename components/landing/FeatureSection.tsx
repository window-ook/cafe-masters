import { FolderCheck, Bookmark, Target } from 'lucide-react';
import React from 'react';

interface IFeatureCard {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description1: string;
    description2: string;
}

const FeatureCard = ({ icon: Icon, title, description1, description2 }: IFeatureCard) => {
    return (
        <div className="group relative">
            {/* 백라이트 */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-main/20 via-purple-300/20 to-main/20 opacity-0 blur transition duration-1000 group-hover:opacity-100" />

            {/* 카드 내용 */}
            <div className="relative rounded-2xl border border-white/50 bg-white/60 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-main/20 to-main/10 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="size-6 text-main" />
                    </div>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-main">
                    {title}
                </h3>

                <p className="leading-relaxed text-gray-600">
                    {description1}
                </p>
                <p className="leading-relaxed text-gray-600">
                    {description2}
                </p>
            </div>
        </div>
    );
};

FeatureCard.displayName = 'FeatureCard';

export default function FeatureSection() {
    const features = [
        {
            id: 1,
            icon: FolderCheck,
            title: '카페 수집',
            description1: '방문했던 카페는 카드로 수집하세요',
            description2: '카페를 자주 다니신다면, 금방 마스터가 될거에요',
        },
        {
            id: 2,
            icon: Bookmark,
            title: '북마크 하기',
            description1: '나중에 갈 카페는 잊을 걱정 없이',
            description2: '북마크 해두고 언제든지 쉽게 찾아보세요',
        },
        {
            id: 3,
            icon: Target,
            title: '추천 리스트',
            description1: '개발자가 직접 가보고 추천하는 카페입니다',
            description2: '어디갈지 고민하지 마세요',
        },
    ];

    return (
        <section className="relative overflow-hidden py-20">
            {/* 배경 */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

            {/* 피쳐 섹션 */}
            <div className="absolute left-10 top-10 h-64 w-64 animate-pulse rounded-full bg-main/10 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-96 w-96 animate-pulse rounded-full bg-purple-200/30 blur-3xl delay-1000" />

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 max-md:text-3xl">
                        여러분에게 필요했던 서비스입니다
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-xl text-gray-600">
                        다녀왔던 카페에서 뭘 마셨는지, 분위기가 어땠는지,<br className='block' />따로 기록하기 번거로우셨죠?
                    </p>
                    <br className='block sm:hidden' />
                    <p className="mx-auto max-w-2xl text-sm sm:text-xl text-gray-600">
                        카페를 찾아서 바로 저장하면 되니까 <br className='block sm:hidden' />카페 마스터즈에서 쉽게 관리해보세요
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <FeatureCard
                            key={feature.id}
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