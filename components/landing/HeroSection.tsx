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
                                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-main/40 via-main-light/40 to-main/40 opacity-70 blur-lg transition duration-1000 group-hover:opacity-100" />
                                <span className="relative inline-flex items-center gap-2 rounded-full border border-main/30 bg-white/80 px-6 py-2 text-sm font-bold text-main backdrop-blur-md shadow-lg">
                                    <Coffee className="h-4 w-4" />
                                    <span className="tracking-wider">수집된 카드 {collectionCafesCounts}장</span>
                                </span>
                            </div>
                        </div>

                        {/* 메인 타이포그래피 */}
                        <h1 className="mb-6 font-black tracking-tighter">
                            <span className="block text-[clamp(48px,10vw,100px)] lg:text-[120px] leading-[0.9] text-white logo-text-shadow">
                                CAFE
                            </span>
                            <span className="block text-[clamp(48px,10vw,100px)] lg:text-[120px] leading-[0.9] text-main logo-text-shadow">
                                MASTERS
                            </span>
                        </h1>

                        {/* 서브 헤드라인 */}
                        <p className="mb-10 max-w-2xl text-[clamp(16px,2vw,20px)] font-bold leading-relaxed text-main drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                            카페 카드를 모아서 <br className="hidden sm:block" />
                            나만의 카페 컬렉션과 지도를 완성하세요
                        </p>

                        {/* 버튼 그룹 */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link
                                href="/main"
                                className="group relative flex w-full sm:w-[180px] items-center justify-center gap-2 rounded-xl border-2 border-main bg-main/70 backdrop-blur-sm px-6 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-main-600 hover:shadow-[0_8px_30px_rgba(218,72,59,0.6)]"
                            >
                                <span>메인 페이지</span>
                            </Link>
                            <Link
                                href="/signin"
                                data-testid="button-go-to-signin-from-landing"
                                className="group relative flex w-full sm:w-[180px] items-center justify-center gap-2 rounded-xl border-2 border-main bg-white/30 backdrop-blur-sm px-6 py-4 text-lg font-bold text-main hover:text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-main-600 hover:shadow-[0_8px_30px_rgba(218,72,59,0.6)]"
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
