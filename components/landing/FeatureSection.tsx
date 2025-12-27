'use client';

import { m } from 'motion/react';
import { FolderCheck, Bookmark, Target } from 'lucide-react';
import React from 'react';
import { useUIStore } from '@/stores';

interface IFeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description1: string;
  description2: string;
  category: string;
  index: number;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description1,
  description2,
  category,
  index,
}: IFeatureCard) => {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  return (
    <div
      className="group relative h-full"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* 백라이트 */}
      <div className="from-main/30 via-main-light/30 to-main/30 absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-0 blur-xl transition duration-500 group-hover:opacity-70" />

      {/* 카드 내용 */}
      <div className="group-hover:border-main/50 relative flex h-full flex-col justify-between rounded-2xl border-2 border-gray-200/20 bg-white/30 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(218,72,59,0.3)] hover:-translate-y-2">
        <div>
          <div className="mb-6 flex items-start justify-between">
            <div className="border-main/20 bg-main/5 text-main group-hover:border-main group-hover:bg-main/10 flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(218,72,59,0.4)]">
              <Icon className="size-7" />
            </div>
            <span className="group-hover:border-main/30 group-hover:bg-main/5 group-hover:text-main rounded-full border border-gray-300/20 bg-gray-100/30 px-3 py-1 text-xs font-bold text-gray-600">
              {category}
            </span>
          </div>

          <h3
            className={`landing-title group-hover:text-main mb-4 text-2xl transition-colors ${isDarkTheme ? 'text-white' : ''}`}
          >
            {title}
          </h3>

          <div className="space-y-1">
            <p
              className={`landing-description leading-relaxed group-hover:text-gray-900 ${isDarkTheme ? 'text-white' : ''}`}
            >
              {description1}
            </p>
            <p
              className={`landing-description leading-relaxed group-hover:text-gray-900 ${isDarkTheme ? 'text-white' : ''}`}
            >
              {description2}
            </p>
          </div>
        </div>

        {/* 하단 데코레이션 */}
        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div className="from-main to-main-light h-full w-0 bg-gradient-to-r transition-all duration-700 ease-out group-hover:w-full" />
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
    <section className="relative overflow-hidden bg-transparent py-32">
      <div className="relative mx-auto max-w-[1400px] px-6">
        {/* 타이포 */}
        <div className="mb-20">
          <m.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-right tracking-tight text-gray-900 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
          >
            <span className="landing-heading">쉽고 편하게</span>
          </m.h2>
        </div>

        {/* 카드 */}
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
