import { createServerSupabaseClient } from '@/utils/supabase/server';
import { Coffee } from 'lucide-react';
import Link from 'next/link';
import SampleCards from '@/components/landing/SampleCards';

async function getCollectionCounts() {
    const supabase = await createServerSupabaseClient(undefined, false);

    const { count, error } = await supabase
        .from('collection')
        .select('*', { count: 'exact', head: true });

    if (error) throw new Error(error.message);

    return count ?? 0;
}

export default async function HeroSection() {
    const collectionCafesCounts = await getCollectionCounts();

    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20 bg-transparent">
            {/* 컨텐츠 */}
            <div className="relative z-10 mx-auto max-w-[1400px] px-6 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

                    {/* 좌측 */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
                        {/* 상단 뱃지 */}
                        <div className="mb-8 animate-fade-in-up">
                            <div className="group relative inline-block">
                                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-main/20 via-main-light/20 to-main/20 opacity-0 blur transition duration-1000 group-hover:opacity-100" />
                                <span className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-main backdrop-blur-md">
                                    <Coffee className="h-4 w-4" />
                                    <span className="tracking-wider">수집된 카드 {collectionCafesCounts}장</span>
                                </span>
                            </div>
                        </div>

                        {/* 메인 타이포그래피 */}
                        <h1 className="mb-6 font-black tracking-tighter text-white">
                            <span className="block text-[clamp(48px,10vw,100px)] lg:text-[120px] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                CAFE
                            </span>
                            <span className="block text-[clamp(48px,10vw,100px)] lg:text-[120px] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-main via-white to-main-light drop-shadow-[0_0_30px_rgba(218,72,59,0.4)]">
                                MASTERS
                            </span>
                        </h1>

                        {/* 서브 헤드라인 */}
                        <p className="mb-10 max-w-2xl text-[clamp(16px,2vw,20px)] font-light leading-relaxed text-white/80">
                            방문한 카페를 카드로 저장하고 <br className="hidden sm:block" />
                            나만의 카페 지도를 완성하는 유일한 공간
                        </p>

                        {/* 버튼 그룹 */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link
                                href="/main"
                                className="group relative flex w-full sm:w-[180px] items-center justify-center gap-2 rounded-xl border border-main/50 bg-main/10 px-6 py-4 text-lg font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-main/20 hover:shadow-[0_0_30px_rgba(218,72,59,0.4)]"
                            >
                                <span>메인으로 GO</span>
                            </Link>

                            <Link
                                href="/signin"
                                className="group relative flex w-full sm:w-[180px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-lg font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                            >
                                <span>로그인</span>
                            </Link>
                        </div>
                    </div>

                    {/* 우측 */}
                    <div className="flex-1 w-full max-w-md lg:max-w-xl">
                        <div className="relative">
                            {/* 배경 글로우 효과 */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-main/5 blur-[100px] rounded-full pointer-events-none" />
                            <SampleCards />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
