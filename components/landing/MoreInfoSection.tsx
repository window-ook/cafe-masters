'use client';

import { EXTERNAL_PATHS, IMAGE_PATHS } from '@/lib/paths';
import { useUIStore } from '@/stores';
import { ExternalLink, MessageSquareText } from 'lucide-react';
import { m } from 'motion/react';
import Image from 'next/image';

export default function MoreInfoSection() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  return (
    <section className="relative w-full overflow-hidden bg-transparent py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <m.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-12 text-5xl font-black tracking-tighter text-gray-900 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] md:text-7xl"
          >
            <span className="landing-heading">더 알아보기</span>
          </m.h2>

          <div className="mb-12 grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            <a
              href={EXTERNAL_PATHS.USER_MANUAL}
              target="_blank"
              rel="noopener noreferrer"
              className="group hover:border-main relative overflow-hidden rounded-3xl border-2 border-gray-200/20 bg-white/30 p-8 text-left shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(218,72,59,0.3)]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-opacity group-hover:opacity-50">
                <ExternalLink className="text-main h-24 w-24 rotate-[-15deg] transition-colors" />
              </div>
              <div className="relative z-10">
                <h3
                  className={`landing-title group-hover:text-main mb-2 text-2xl transition-colors ${isDarkTheme ? 'text-white' : ''}`}
                >
                  User Guide
                </h3>
                <p
                  className={`landing-description ${isDarkTheme ? 'text-white' : 'group-hover:text-text-primary'}`}
                >
                  카페 마스터즈 사용법 보러가기
                </p>
              </div>
            </a>

            <a
              href={EXTERNAL_PATHS.GOOGLE_FORM_FEEDBACK}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl border-2 border-gray-200/20 bg-white/30 p-8 text-left shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-opacity group-hover:opacity-50">
                <MessageSquareText className="h-24 w-24 rotate-[15deg] text-blue-500 transition-colors" />
              </div>
              <div className="relative z-10">
                <h3
                  className={`landing-title mb-2 text-2xl transition-colors group-hover:text-blue-500 ${isDarkTheme ? 'text-white' : ''}`}
                >
                  Feedback
                </h3>
                <p
                  className={`landing-description ${isDarkTheme ? 'text-white' : 'group-hover:text-text-primary'}`}
                >
                  서비스 개선 의견 보내기
                </p>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-medium tracking-widest text-gray-700 ${isDarkTheme ? 'text-white' : 'text-text-primary'}`}
            >
              @cafemasters_official
            </span>
            <div className="h-px w-12 bg-gray-400" />
            <a
              href={EXTERNAL_PATHS.INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 transition-colors hover:text-gray-900"
            >
              <div className="hover:border-main rounded-full border-2 border-gray-200/20 bg-white/30 p-3 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:shadow-[0_4px_12px_rgba(218,72,59,0.2)]">
                <Image
                  src={IMAGE_PATHS.INSTAGRAM_LOGO}
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="opacity-80 hover:opacity-100"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
