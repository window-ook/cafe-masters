import { createServerSupabaseClient } from '@/utils/supabase/server';
import { Coffee } from 'lucide-react';
import Link from 'next/link';
import SampleCards from '@/components/landing/SampleCards';
import MainThemeBackground from '@/components/shared/MainThemeBackground';

async function getCollectionCounts() {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('collection')
        .select('*', { count: 'exact' });

    if (error) throw new Error(error.message);

    return data?.length ?? 0;
}

export default async function HeroSection() {
    const collectionCafesCounts = await getCollectionCounts();
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
            {/* 배경 */}
            <MainThemeBackground />

            {/* 컨텐츠 */}
            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                <div className="mb-6">
                    <div className="group relative inline-block">
                        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-main/20 via-purple-300/20 to-main/20 opacity-0 blur transition duration-1000 group-hover:opacity-100" />
                        <span className="relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-main-light backdrop-blur-xl">
                            <Coffee className="h-4 w-4" />
                            총 수집된 카드 {collectionCafesCounts}개
                        </span>
                    </div>
                </div>

                {/* 대표 타이포 */}
                <h1 className="mb-6 text-2xl sm:text-6xl font-bold leading-tight text-white">
                    카페 컬렉션의 새로운 경험을
                    <br />
                    <span className="bg-gradient-to-r from-main-light to-main bg-clip-text text-transparent">
                        시작하세요
                    </span>
                </h1>

                <div className="flex flex-col justify-center items-center gap-8">
                    <SampleCards />
                    {/* 입장하기 버튼 */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-main/20 via-purple-300/20 to-main/20 opacity-0 blur transition duration-1000 group-hover:opacity-100" />
                        <Link
                            href="/main"
                            className="relative rounded-xl bg-main px-12 py-4 font-bold text-3xl font-dunggeunmo text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-main-dark hover:shadow-2xl"
                        >
                            START
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}