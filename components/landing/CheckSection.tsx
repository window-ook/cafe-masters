'use client';

import { EXTERNAL_PATHS, IMAGE_PATHS } from '@/lib/paths';
import { ExternalLink, MessageSquareText } from 'lucide-react';
import { m } from 'motion/react';
import Image from 'next/image';

export default function CheckSection() {
    return (
        <section className="relative w-full overflow-hidden py-32 bg-transparent">
            <div className="relative mx-auto max-w-7xl px-6">
                <div className="flex flex-col items-center justify-center text-center">
                    <m.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="mb-12 text-5xl font-black tracking-tighter text-white md:text-7xl"
                    >
                        <span className="text-white">더 알아보기</span>
                    </m.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
                        <a
                            href={EXTERNAL_PATHS.USER_MANUAL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden rounded-3xl bg-white/5 p-8 text-left border border-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-main/50 hover:bg-main/5 hover:shadow-[0_0_30px_rgba(218,72,59,0.2)]"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                <ExternalLink className="w-24 h-24 text-white rotate-[-15deg] group-hover:text-main transition-colors" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-main transition-colors">User Guide</h3>
                                <p className="text-gray-400 group-hover:text-gray-300">카페 마스터즈 사용법 보러가기</p>
                            </div>
                        </a>

                        <a
                            href={EXTERNAL_PATHS.GOOGLE_FORM_FEEDBACK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden rounded-3xl bg-white/5 p-8 text-left border border-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-blue-500/5 hover:shadow-[0_0_30px_rgba(56, 56, 247, 0.86)]"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                <MessageSquareText className="w-24 h-24 text-white rotate-[15deg] group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-500 transition-colors">Feedback</h3>
                                <p className="text-gray-400 group-hover:text-gray-300">서비스 개선 의견 보내기</p>
                            </div>
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 tracking-widest text-sm">@cafemasters_official</span>
                        <div className="h-px w-12 bg-gray-800" />
                        <a
                            href={EXTERNAL_PATHS.INSTAGRAM}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110">
                                <Image
                                    src={IMAGE_PATHS.INSTAGRAM_LOGO}
                                    alt='Instagram'
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
