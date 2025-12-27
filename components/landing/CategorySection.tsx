'use client';

import { m } from 'motion/react';
import {
  CakeSlice,
  PiggyBank,
  MicOff,
  Plug,
  SquareParking,
  Smile,
} from 'lucide-react';
import { useUIStore } from '@/stores';

const CATEGORIES = [
  {
    title: '커피가 맛있는',
    description: '커피 본연의 맛을 즐길 수 있는 카페',
    icon: Smile,
  },
  {
    title: '디저트가 맛있는',
    description: '달콤한 디저트가 가득한 카페',
    icon: CakeSlice,
  },
  {
    title: '가격이 합리적인',
    description: '부담 없는 가격으로 즐기는 카페',
    icon: PiggyBank,
  },
  {
    title: '조용한',
    description: '집중하기 좋은 차분한 분위기',
    icon: MicOff,
  },
  {
    title: '콘센트 많은',
    description: '노트북 작업하기 최적의 장소',
    icon: Plug,
  },
  {
    title: '주차장 있는',
    description: '드라이브와 함께하기 좋은 카페',
    icon: SquareParking,
  },
];

export default function CategorySection() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  return (
    <section className="relative overflow-hidden bg-transparent py-32">
      <div className="relative mx-auto max-w-[1400px] px-6">
        {/* 섹션 헤더 */}
        <div className="mb-20 text-center">
          <m.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`text-4xl font-bold tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] sm:text-6xl ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}
          >
            다양한 <span className="landing-heading">카테고리</span>
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className={`landing-paragraph mt-4 ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
          >
            원하는 분위기와 목적에 맞는 카페를 쉽게 찾아보세요.
          </m.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <div key={index} className="group relative">
              {/* 백라이트 효과 */}
              <div className="from-main/30 to-main-light/30 absolute -inset-px rounded-xl bg-gradient-to-r opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />

              <div className="hover:border-main/40 relative h-full rounded-xl border-2 border-gray-200/20 bg-white/30 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(218,72,59,0.2)]">
                <div className="mb-6 flex items-center justify-between">
                  <div className="border-main/20 bg-main/5 text-main group-hover:border-main group-hover:bg-main/10 flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(218,72,59,0.4)]">
                    <category.icon className="size-6" />
                  </div>
                  <span
                    className={`group-hover:text-main text-xs font-bold transition-colors ${isDarkTheme ? 'text-white' : 'text-gray-500'}`}
                  >
                    0{index + 1}
                  </span>
                </div>
                <h3
                  className={`landing-title group-hover:text-main mb-2 text-xl transition-colors ${isDarkTheme ? 'text-white' : ''}`}
                >
                  {category.title}
                </h3>
                <p
                  className={`landing-description text-sm transition-colors group-hover:text-gray-900 ${isDarkTheme ? 'text-white' : ''}`}
                >
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
