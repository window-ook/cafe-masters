import React from 'react';
import { Code, Trophy, MessageCircle, RefreshCw, Star, Smartphone } from 'lucide-react';

interface IBenefitCard {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

const BenefitCard: React.FC<IBenefitCard> = ({ icon: Icon, title, description }) => {
    return (
        <div className="group relative">
            {/* Backlight Effect */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-main-light/30 via-purple-300/30 to-main-light/30 opacity-0 blur transition duration-1000 group-hover:opacity-100" />

            {/* Main Card */}
            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-main/20 to-main/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-main/30">
                    <Icon className="h-8 w-8 text-main transition-transform duration-300 group-hover:scale-110" />
                </div>

                <h3 className="mb-4 text-xl font-bold text-white transition-colors group-hover:text-main-light">
                    {title}
                </h3>

                <p className="leading-relaxed text-gray-300 text-sm sm:text-base">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default function BenefitsSection() {
    const benefits = [
        {
            icon: Code,
            title: '개발자가 만든 서비스',
            description: '실제로 카페를 자주 방문하는 개발자가\n직접 만든 서비스입니다',
        },
        {
            icon: Trophy,
            title: '컬렉션 티어',
            description: '카페를 수집하면서 컬렉션이 늘어나면 티어가 계속 상승합니다\n마스터까지 가보세요',
        },
        {
            icon: MessageCircle,
            title: '빠른 커뮤니티 지원',
            description: '궁금한 점이 있으시면 언제든지 커뮤니티에서 도움을 받으세요',
        },
        {
            icon: RefreshCw,
            title: '지속적인 업데이트',
            description: '새로운 카페 정보와 기능이 계속 업데이트됩니다\n계속 발전하고자 합니다',
        },
        {
            icon: Star,
            title: '프리미엄 경험',
            description: '모든 기능은 무료로 제공합니다\n피드백을 주시면 더 좋은 서비스로 발전할 수 있습니다',
        },
        {
            icon: Smartphone,
            title: '모든 기기에서 접근',
            description: 'PC, 태블릿, 모바일 어떤 기기에서든\n편리하게 사용하세요',
        },
    ];

    return (
        <section className="relative overflow-hidden py-20">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-main-dark via-gray-900 to-main-dark" />

            {/* Blur Elements */}
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
                            description={benefit.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}