import { unstable_cache } from 'next/cache';
import { createCacheableSupabaseClient } from '@/utils/supabase/server';
import { Coffee } from 'lucide-react';
import Link from 'next/link';
import SampleCards from '@/components/landing/SampleCards';

const getCachedCollectionCounts = unstable_cache(
  async () => {
    const supabase = await createCacheableSupabaseClient();

    const { count, error } = await supabase
      .from('collection')
      .select('*', { count: 'exact', head: true });

    if (error) throw new Error(error.message);

    return count ?? 0;
  },
  ['collection-counts'],
  {
    revalidate: 3600,
    tags: ['collection-counts'],
  }
);

export default async function HeroSection() {
  const collectionCafesCounts = await getCachedCollectionCounts();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent pt-20">
      {/* 컨텐츠 */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-20">
          {/* 좌측 */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            {/* 상단 뱃지 */}
            <div className="animate-fade-in-up mb-8">
              <div className="group relative inline-block">
                <div className="from-main/40 via-main-light/40 to-main/40 absolute -inset-0.5 rounded-full bg-gradient-to-r opacity-70 blur-lg transition duration-1000 group-hover:opacity-100" />
                <span className="border-main/30 text-main relative inline-flex items-center gap-2 rounded-full border bg-white/80 px-6 py-2 text-sm font-bold shadow-lg backdrop-blur-md">
                  <Coffee className="h-4 w-4" />
                  <span className="tracking-wider">
                    수집된 카드 {collectionCafesCounts}장
                  </span>
                </span>
              </div>
            </div>

            {/* 메인 타이포그래피 */}
            <h1 className="mb-6 font-black tracking-tighter">
              <span className="logo-text-shadow block text-[clamp(48px,10vw,100px)] leading-[0.9] text-white lg:text-[120px]">
                CAFE
              </span>
              <span className="text-main logo-text-shadow block text-[clamp(48px,10vw,100px)] leading-[0.9] lg:text-[120px]">
                MASTERS
              </span>
            </h1>

            {/* 서브 헤드라인 */}
            <p className="text-main mb-10 max-w-2xl text-[clamp(16px,2vw,20px)] leading-relaxed font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              카페 카드를 모아서 <br className="hidden sm:block" />
              나만의 카페 컬렉션과 지도를 완성하세요
            </p>

            {/* 버튼 그룹 */}
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Link
                href="/main"
                className="group border-main bg-main/70 hover:bg-main-600 relative flex w-full items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 text-lg font-bold text-white shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(218,72,59,0.6)] sm:w-[180px]"
              >
                <span>메인 페이지</span>
              </Link>
              <Link
                href="/signin"
                data-testid="button-go-to-signin-from-landing"
                className="group border-main text-main hover:bg-main-600 relative flex w-full items-center justify-center gap-2 rounded-xl border-2 bg-white/30 px-6 py-4 text-lg font-bold shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:text-white hover:shadow-[0_8px_30px_rgba(218,72,59,0.6)] sm:w-[180px]"
              >
                <span>로그인</span>
              </Link>
            </div>
          </div>

          {/* 우측 */}
          <div className="w-full max-w-md flex-1 lg:max-w-xl">
            <div className="relative">
              {/* 배경 글로우 효과 */}
              <div className="bg-main/5 pointer-events-none absolute top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />
              <SampleCards />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
