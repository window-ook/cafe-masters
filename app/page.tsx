'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleRouteSignin = () => router.push('/auth');

  return (
    <main className="min-h-screen max-w-screen overflow-hidden">
      {/* 네브바 */}
      <section className="fixed h-[4rem] w-full">
        <div className="flex justify-between items-center px-[25rem]">
          <div className="flex items-center">
            <Image
              src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/card_transparent.webp"
              alt="logo image"
              height={10}
              width={60}
              className="w-auto h-auto"
            />
            <span className="text-3xl text-white text-shadow-black font-pretendard font-bold">
              Cafe Masters
            </span>
          </div>
          <button
            onClick={() => handleRouteSignin()}
            className="w-[6rem] h-[2rem] rounded-md bg-gray-200 opacity-80 hover:opacity-40 transition duration-100 ease-in"
          >
            <span className="font-pretendard text-gray-800">시작하기</span>
          </button>
        </div>
      </section>

      {/* 1st Section 중첩 모션 카드 */}
      <section className="w-full h-[40rem] bg-cover bg-center bg-main_light"></section>

      {/* 2nd Section 사용자들의 리뷰 카드 & Contact Us */}
      <section className="w-full h-[40rem] bg-cover bg-center bg-gray-100">
        {/* 리뷰 카드 */}
        {/* Contact Us */}
      </section>
    </main>
  );
}
