import React from 'react';

interface IStatCard {
    number: string;
    label: string;
}

const StatCard: React.FC<IStatCard> = ({ number, label }) => {
    return (
        <div className="group relative">
            {/* Backlight Effect */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-main-light/30 via-purple-300/30 to-main-light/30 opacity-0 blur transition duration-1000 group-hover:opacity-100" />

            {/* Main Card */}
            <div className="relative rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-2 text-5xl font-bold text-main-light transition-all duration-300 group-hover:scale-110 max-md:text-4xl">
                    {number}
                </div>
                <div className="text-xl font-medium text-gray-300 transition-colors group-hover:text-white">
                    {label}
                </div>
            </div>
        </div>
    );
};

export default function StatisticsSection() {
    const stats = [
        {
            number: '5,000+',
            label: '수집된 카페',
        },
        {
            number: '1,200+',
            label: '활성 사용자',
        },
        {
            number: '15+',
            label: '카페 카테고리',
        },
        {
            number: '4.8',
            label: '사용자 만족도',
        },
    ];

    return (
        <section className="relative overflow-hidden py-20">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-main-dark via-slate-900 to-main-dark" />

            {/* Blur Elements */}
            <div className="absolute left-1/4 top-20 h-80 w-80 animate-pulse rounded-full bg-main/20 blur-3xl" />
            <div className="absolute bottom-20 right-1/3 h-64 w-64 animate-pulse rounded-full bg-purple-200/20 blur-3xl delay-700" />

            <div className="relative mx-auto max-w-7xl px-6 text-white">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-4xl font-bold max-md:text-3xl">
                        카페 마스터즈 현황
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-main-light">
                        지난 1년간 전 세계 사용자들과 함께 만들어낸 놀라운 성과들입니다
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            number={stat.number}
                            label={stat.label}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

StatisticsSection.displayName = 'StatisticsSection';