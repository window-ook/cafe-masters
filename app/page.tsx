'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSigninMutation } from 'hooks/mutation/useSigninMutation';
import Image from 'next/image';
import Link from 'next/link';

// 반응형 스타일 참고 1100, 1020, 690, 560

const Navbar = () => {
  const router = useRouter();

  const signinMutation = useSigninMutation();

  const handleTestSignin = async () => {
    try {
      const response = await fetch('/api/auth/test-credential');
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || '테스트 계정 정보를 불러오지 못했습니다.',
        );

      setTimeout(() => {
        signinMutation.mutate(
          { email: data.email, password: data.password },
          {
            onSuccess: () => {
              router.refresh();
              router.push('/cafe');
            },
          },
        );
      }, 0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-transparent shadow-md backdrop-blur-lg">
      <nav className="max-w-5xl h-[4rem] px-6 py-2 mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/image/logo.avif"
            alt="로고 아이콘"
            width={100}
            height={100}
            className="w-[2rem] h-auto"
            priority={true}
          />
          <span className="text-3xl max-[560px]:text-xl text-white text-shadow-black font-pretendard font-bold">
            Cafe Masters
          </span>
        </div>
        <div className="flex gap-4">
          <button
            aria-label="체험계정 로그인 버튼"
            onClick={() => handleTestSignin()}
            className="h-[2rem] border-2 border-solid border-opacity-50 border-neutral-100 rounded-md p-4 flex items-center hover:opacity-40 transition duration-100 ease-in"
          >
            <span className="font-pretendard font-bold text-white">
              체험하기
            </span>
          </button>
          <Link
            href="/auth"
            aria-label="로그인 페이지 이동 버튼"
            className="h-[2rem] rounded-md flex justify-center items-center hover:opacity-40 transition duration-100 ease-in"
          >
            <span className="font-pretendard font-bold text-main-light">
              시작하기
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

const ScrollSections = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const sections = [
    {
      id: 1,
      title: '나만의 카드를\n수집하세요',
      subtitle: '01',
      description:
        '마스터즈 월드에는 모든 카페가 있습니다\n여러분이 갔던 카페를 수집해 마스터가 되세요!',
      imageUrl: '/image/scroll_section.avif',
    },
    {
      id: 2,
      title: '가보고 싶은 곳을\n저장해두세요',
      subtitle: '02',
      description:
        '어딜 가려고 했는지 생각이 안 날 때가 있죠?\n북마크로 저장하고 잊지 마세요!',
      imageUrl: '/image/scroll_section_1.avif',
    },
    {
      id: 3,
      title: '카테고리별\n카페를 추천해드려요',
      subtitle: '03',
      description:
        '개발자가 직접 추천하는 카페입니다\n내가 찾는 조건으로 필터링해보세요',
      imageUrl: '/image/scroll_section_2.avif',
    },
  ];

  const handleView = (index: number) => {
    if (containerRef.current) {
      containerRef.current.children[index].scrollIntoView({
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const index = Math.round(
      containerRef.current.scrollTop / window.innerHeight,
    );

    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (container) container.addEventListener('scroll', handleScroll);

    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <main
      ref={containerRef}
      className="h-full scroll-container scrollbar-hidden overflow-y-scroll overflow-x-hidden scroll-snap-y scroll-snap-mandatory"
    >
      {sections.map((section, index) => (
        <section
          key={section.id}
          className="relative h-full scroll-section flex max-[1020px]:flex-col"
        >
          {index !== 1 ? (
            <>
              <div className="group relative max-[1020px]:w-full w-1/2 max-[1020px] h-1/2 md:h-full overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-neutral-950/70 before:to-neutral-950/50 before:transition-opacity before:duration-500 hover:before:opacity-0">
                <Image
                  src={section.imageUrl}
                  alt={section.title}
                  fill
                  sizes="(max-width: 1200px) 100vh, 50vw"
                  className="absolute inset-0 w-full h-full object-cover object-center saturate-150 group-hover:scale-110 group-hover:rotate-1 transition-all duration-1000"
                  priority={true}
                />
              </div>
              <div className="max-[1020px]:w-full w-1/2 max-[1020px] h-1/2 md:h-full p-8 whitespace-nowrap flex items-center justify-center bg-neutral-950">
                <div className="max-w-lg animate-float">
                  <span className="text-neutral-400 tracking-wider text-sm font-mono">
                    {section.subtitle.split('\n').map((text, index) => (
                      <span key={index}>
                        {text}
                        <br />
                      </span>
                    ))}
                  </span>
                  <h2 className="mt-4 leading-none bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-6xl max-[1100px]:text-4xl font-bold text-transparent">
                    {section.title.split('\n').map((text, index) => (
                      <span key={index}>
                        {text}
                        <br />
                      </span>
                    ))}
                  </h2>
                  <p className="mt-6 text-neutral-400 text-lg leading-relaxed">
                    {section.description.split('\n').map((text, index) => (
                      <span key={index}>
                        {text}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="max-[1020px]:w-full w-1/2 max-[1020px] h-1/2 md:h-full p-8 bg-neutral-950 flex items-center justify-center whitespace-nowrap">
                <div className="max-w-lg animate-float">
                  <span className="text-neutral-400 tracking-wider text-sm font-mono">
                    {section.subtitle.split('\n').map((text, index) => (
                      <span key={index}>
                        {text}
                        <br />
                      </span>
                    ))}
                  </span>
                  <h2 className="mt-4 leading-none bg-gradient-to-r from-white to-neutral-400 text-6xl max-[1100px]:text-4xl font-bold bg-clip-text text-transparent">
                    {section.title.split('\n').map((text, index) => (
                      <span key={index}>
                        {text}
                        <br />
                      </span>
                    ))}
                  </h2>
                  <p className="mt-6 text-neutral-400 text-lg leading-relaxed">
                    {section.description.split('\n').map((text, index) => (
                      <span key={index}>
                        {text}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="group relative max-[1020px]:w-full w-1/2 max-[1020px] h-1/2 md:h-full overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-neutral-950/70 before:to-neutral-950/50 before:transition-opacity before:duration-500 hover:before:opacity-0">
                <Image
                  src={section.imageUrl}
                  alt={section.title}
                  fill
                  sizes="(max-width: 1200px) 100vh, 50vw"
                  className="absolute inset-0 w-full h-full object-cover object-center saturate-150 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                  priority={true}
                />
              </div>
            </>
          )}
        </section>
      ))}
      <div className="absolute z-50 right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {sections.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => handleView(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'bg-white scale-150'
                : 'bg-white/20 hover:bg-white hover:scale-150'
            }`}
            title={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </main>
  );
};

const useIntersection = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const wasVisible = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          wasVisible.current = true;
        } else if (!wasVisible.current) setIsVisible(false);
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
};

const ReviewCards = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersection(ref);

  const reviews = [
    {
      id: 1,
      rating: 4.2,
      content: '카페에 대한 정보를 한 곳에서 볼 수 있으니 좋아요',
      imageUrl: '😋',
      user: '유저 A',
    },
    {
      id: 2,
      rating: 4.4,
      content: '갔던 곳이나 갈 곳을 다 기록할 수 있어서 편해요',
      imageUrl: '🥳',
      user: '유저 B',
    },
    {
      id: 3,
      rating: 4.2,
      content:
        '어떤 걸 먹었는지 일일이 적어두기 귀찮았는데, 컨셉도 바로 볼 수 있어 좋아요',
      imageUrl: '☺️',
      user: '유저 C',
    },
    {
      id: 4,
      rating: 4.3,
      content: '코딩하기 좋은 카페를 찾아가기 쉬워졌어요',
      imageUrl: '🧑‍💻',
      user: '유저 D',
    },
  ];

  return (
    <div
      ref={ref}
      className={`max-w-[80rem] mx-auto px-10 sm:px-16 md:px-20 lg:px-24 xl:px-32 transition-all duration-1000 ease-out
         ${isVisible ? 'opacity-100' : 'opacity-0'}
         `}
    >
      <div
        className={`${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-[20rem]'
        } flex flex-col gap-2`}
      >
        <div className="h-[2rem] rounded-md flex items-center">
          <span className="flex flex-col text-lg max-sm:text-sm font-pretendard text-main font-bold">
            유저의 목소리를 듣습니다
          </span>
        </div>
        <span className="bg-gradient-to-r from-black to-neutral-500 bg-clip-text text-5xl max-lg:text-4xl max-md:text-2xl max-sm:text-lg font-pretendard font-bold text-transparent max-lg:text-shadow-none">
          실제 피드백과 리뷰
        </span>
      </div>

      <div className="pt-20 max-[560px]:pt-10 flex max-[560px]:flex-col gap-4">
        {reviews.map((review, index) => (
          <article
            key={review.id}
            className={`w-[25%] max-[560px]:w-full h-[20rem] max-[560px]:h-[12rem] p-4 bg-black rounded-xl flex flex-col justify-between transition-all duration-1000 ease-out
              ${index % 2 === 0 ? 'translate-y-4 max-[560px]:translate-y-0' : 'translate-y-24 max-[560px]:translate-y-0'}
                  ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-[20rem]'
                  }`}
          >
            <div className="flex flex-col gap-2">
              <span className="text-gray-400">{review.rating}</span>
              <h3 className="text-xl max-[690px]:text-lg max-[560px]:text-sm font-pretendard font-bold text-gray-300 hover:text-main transition duration-200 ease-in">
                {review.content}
              </h3>
            </div>
            <footer className="flex items-center gap-2">
              <span className="text-white text-xl max-[690px]:text-sm">
                {review.imageUrl}
              </span>
              <span className="text-main-light font-bold text-xl max-[690px]:text-sm max-[560px]:text-sm">
                {review.user}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
};

const Contactme = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const isVisible = useIntersection(ref);

  return (
    <div
      ref={ref}
      className={`w-full max-w-[80rem] mx-auto px-10 sm:px-16 md:px-20 lg:px-24 xl:px-32 flex flex-col gap-4 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[15rem] opacity-0'} transition-all duration-1000 ease-out`}
    >
      <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-5xl max-lg:text-4xl max-md:text-2xl max-sm:text-lg font-pretendard font-bold text-transparent max-lg:text-shadow-none">
        Contact me<span className="text-main">.</span>
      </span>
      <div className="flex gap-6 justify-between">
        <div className="w-[50%] h-[10rem] p-4 rounded-xl bg-gray-800 flex flex-col justify-center">
          <div className="flex justify-between">
            <span className="text-2xl max-[690px]:text-xl max-[560px]:text-xs font-pretendard font-bold text-white">
              피드백을 들려주세요
            </span>
            <button
              type="button"
              aria-label="피드백 메일 발송하기 버튼"
              className="text-white"
              onClick={() => window.open('mailto:cwl64658@gmail.com', '_blank')}
            >
              <span className="text-4xl max-[690px]:text-lg font-pretendard font-bold text-white">
                ↗
              </span>
            </button>
          </div>
          <span className="text-[1rem] max-[690px]:text-sm max-[560px]:text-xs font-bold text-main-light hover:text-gray-200 transition-colors duration-300">
            cwl64658@gmail.com
          </span>
        </div>
        <div className="w-[50%] h-[10rem] p-4 bg-gray-800 rounded-xl flex flex-col justify-center">
          <div className="flex justify-between">
            <span className="text-2xl max-[690px]:text-xl max-[560px]:text-xs font-pretendard font-bold text-white">
              데모 시청하기
            </span>
            <button
              type="button"
              aria-label="카페 마스터즈 데모 영상 링크 버튼"
              className="text-white"
              onClick={() =>
                window.open(
                  'https://www.youtube.com/watch?v=7vk0clfjUh4',
                  '_blank',
                )
              }
            >
              <span className="text-4xl max-[690px]:text-lg font-pretendard font-bold text-white">
                ↗
              </span>
            </button>
          </div>
          <span className="text-[1rem] max-[690px]:text-sm max-[560px]:text-xs font-bold text-main-light hover:text-gray-200 transition-colors duration-300">
            카페 마스터즈를 어떻게 사용하는지 알려드려요
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen max-w-screen overflow-hidden">
      <Navbar />
      {/* 1st Section 중첩 모션 카드 */}
      <section className="w-full h-[60rem] bg-cover bg-center bg-main_light">
        <ScrollSections />
      </section>

      {/* 2nd Section 사용자들의 리뷰 카드 */}
      <section className="w-full h-[60rem] max-[560px]:h-[70rem] max-[560px]:pt-20 pt-60 bg-gray-100">
        <ReviewCards />
      </section>

      {/* 3rd Section Contact Us */}
      <section className="w-full h-[30rem] pt-32 bg-black">
        <Contactme />
      </section>
    </main>
  );
}
