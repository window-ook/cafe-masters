import { createServerSupabaseClient } from '@/utils/supabase/server';
import { Coffee, Sticker, Star } from 'lucide-react';
import Link from 'next/link';

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
            {/* 그레이디언트 배경 */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-main-900 to-green-900" />

            {/* 움직이는 블러 */}
            <div className="absolute -left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-main/30 blur-3xl" />
            <div className="absolute -right-20 bottom-20 h-96 w-96 animate-pulse rounded-full bg-purple-200/50 blur-3xl delay-1000" />
            <div className="absolute left-1/2 top-1/3 h-64 w-64 animate-pulse rounded-full bg-main-light/20 blur-3xl delay-500" />

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
                    {/* 샘플 카드 */}
                    <div className="card-container relative size-88">
                        <div className="card-tilt w-full h-full p-4 border-6 rounded-2xl drop-shadow-3xl bg-gradient-to-br from-[#B5582D] via-[#C28D65] to-[#C59066] border-gray-500 flex flex-col justify-between">
                            {/* 카페 이름 */}
                            <div className="flex flex-col gap-2">
                                <p className="whitespace-nowrap overflow-hidden text-left text-ellipsis font-dunggeunmo font-bold text-lg">
                                    반갑습니다 사용자님!
                                </p>
                                {/* 별점 */}
                                <div className="flex justify-start gap-0.5">
                                    {Array(2)
                                        .fill(0)
                                        .map((_, index) => (
                                            <div key={index} className="rating-red-circle">
                                                <Star className="fill-rating-star text-rating-star size-3" />
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* 일러스트 */}
                            <div className="z-10 h-24 bg-gray-700 rounded-lg flex flex-col">
                                <div className="h-40 w-full bg-gradient-to-br from-orange-200 to-orange-400 rounded-t-md flex items-center justify-center">
                                    <Sticker className="h-12 w-12 text-orange-800" />
                                </div>
                                <div className="h-4 w-full bg-white rounded-b-md flex items-center justify-center">
                                    <span className="text-xs text-black">CAFE MASTERS</span>
                                </div>
                            </div>

                            {/* 주소와 전화번호 */}
                            <div className="relative z-10 px-2 rounded-md border-[0.125rem] border-gray-500 flex flex-col"
                                style={{ backgroundColor: '#E8CEB7' }}>
                                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 size-1.5 border-gray-600 bg-gray-500 border" />
                                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 size-1.5 border-gray-600 bg-gray-500 border" />
                                <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 size-1.5 border-gray-600 bg-gray-500 border" />
                                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 size-1.5 border-gray-600 bg-gray-500 border" />

                                <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-gray-600">
                                    카드를 많이 수집해서
                                </p>
                                <p className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-gray-600">
                                    카페 마스터가 되세요!
                                </p>
                            </div>
                        </div>
                    </div>

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