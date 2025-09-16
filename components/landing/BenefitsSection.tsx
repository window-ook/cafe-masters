import { Code, Trophy, MessageCircle, RefreshCw, Star, Smartphone } from 'lucide-react';
import React from 'react';

interface IBenefitCard {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description1: string;
    description2: string;
}

const BenefitCard: React.FC<IBenefitCard> = ({ icon: Icon, title, description1, description2 }) => {
    return (
        <div className="group relative">
            {/* 백라이트 */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-main-light/30 via-purple-300/30 to-main-light/30 opacity-0 blur transition duration-1000 group-hover:opacity-100" />

            {/* 카드 내용 */}
            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-main/20 to-main/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-main/30">
                    <Icon className="h-8 w-8 text-main transition-transform duration-300 group-hover:scale-110" />
                </div>

                <h3 className="mb-4 text-xl font-bold text-white transition-colors group-hover:text-main-light">
                    {title}
                </h3>

                <p className="leading-relaxed text-gray-300 text-sm sm:text-base">
                    {description1}
                </p>
                <p className="leading-relaxed text-gray-300 text-sm sm:text-base">
                    {description2}
                </p>
            </div>
        </div>
    );
};

export default function BenefitsSection() {
    const benefits = [
        {
            icon: Code,
            title: '카공족 개발자',
            description1: '실제로 카페를 자주 방문하는 개발자가',
            description2: '직접 만든 서비스입니다',
        },
        {
            icon: Trophy,
            title: '컬렉션 티어',
            description1: '카페를 수집하면서 컬렉션이 늘어나면',
            description2: '티어가 계속 상승합니다\n마스터까지 가보세요',
        },
        {
            icon: Star,
            title: '올인원 서비스',
            description1: '카페에 관련된 건 ',
            description2: '카페 마스터즈에서 전부 다 할 수 있으니까요',
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
            description2: '개발자도 직접 사용하고 있는 서비스에요',
        },
        {
            icon: Smartphone,
            title: '디바이스 프리',
            description1: 'PC, 모바일 어떤 환경이라도',
            description2: '편리하게 사용하세요',
        },
    ];

    return (
        <section className="relative overflow-hidden py-20">
            {/* 배경 */}
            <div className="absolute inset-0 bg-gradient-to-br from-main-dark via-gray-900 to-main-dark" />

            {/* 베네핏 섹션 */}
            <div className="absolute left-1/4 top-20 h-80 w-80 animate-pulse rounded-full bg-main/20 blur-3xl" />
            <div className="absolute bottom-20 right-1/3 h-64 w-64 animate-pulse rounded-full bg-purple-200/20 blur-3xl delay-700" />

            <div className="relative mx-auto max-w-7xl px-6 text-white">
                <div className="mb-16 text-center">
                    <span className="font-semibold text-lg text-main-light">놓치지 마세요</span>
                    <h2 className="mb-4 mt-2 text-2xl sm:text-4xl font-bold text-white">
                        카페 마스터즈만의 특별한 경험
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm sm:text-xl text-main-light">
                        다른 서비스에서는 경험할 수 없는 <br className='block sm:hidden' />카페 마스터즈만의 풍부한 혜택들을 즐겨보세요
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((benefit, index) => (
                        <BenefitCard
                            key={index}
                            icon={benefit.icon}
                            title={benefit.title}
                            description1={benefit.description1}
                            description2={benefit.description2}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}