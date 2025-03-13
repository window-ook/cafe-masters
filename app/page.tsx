'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Navbar() {
  const router = useRouter();

  const handleRouteSignin = () => router.push('/auth');

  return (
    <section className="fixed top-0 left-0 z-50 w-full bg-transparent shadow-md backdrop-blur-lg">
      <div className="max-w-5xl h-[4rem] px-6 py-2 mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-3xl text-white text-shadow-black font-pretendard font-bold">
            Cafe Masters
          </span>
        </div>
        <button
          onClick={() => handleRouteSignin()}
          className="h-[2rem] rounded-md opacity-80 hover:opacity-40 transition duration-100 ease-in"
        >
          <span className="font-pretendard font-bold text-mainLanding">
            시작하기
          </span>
        </button>
      </div>
    </section>
  );
}

function ScrollSections() {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const sections = [
    {
      id: 1,
      title: '여러분만의 카드를\n수집하세요',
      subtitle: '01',
      description:
        '마스터즈 월드에서는 여러분이 찾는 모든 카페가 있습니다.\n내가 가 본 카페를 수집해 마스터가 되세요!',
      imageUrl: '/image/scroll_section.avif',
    },
    {
      id: 2,
      title: '가보고 싶은 곳을\n저장해두세요',
      subtitle: '02',
      description:
        '마음에 드는 카페가 있는데 막상 가기전에 생각이 안 날 때가 있죠?\n북마크로 저장하고 잊지 마세요!',
      imageUrl: '/image/scroll_section_1.avif',
    },
    {
      id: 3,
      title: '개발자를 위한\n카페를 알려드려요',
      subtitle: '03',
      description:
        '커피 한 잔과 코딩에 집중할 수 있는 좋은 카페를\n마스터즈 월드의 창조주가 알려드립니다!',
      imageUrl: '/image/scroll_section_2.avif',
    },
  ];

  const scrollToSection = (index: number) => {
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

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="h-full scroll-container scrollbar-hidden overflow-y-scroll overflow-x-hidden scroll-snap-y scroll-snap-mandatory"
    >
      {sections.map((section, index) => (
        <section
          key={section.id}
          className="relative h-full scroll-section flex flex-col md:flex-row"
        >
          {index !== 1 ? (
            <>
              <div className="group relative overflow-hidden w-full md:w-1/2 h-1/2 md:h-full before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-neutral-950/70 before:to-neutral-950/50 before:transition-opacity before:duration-500 hover:before:opacity-0">
                <Image
                  src={section.imageUrl}
                  alt={section.title}
                  fill
                  quality={100}
                  className="absolute inset-0 w-full h-full object-cover saturate-150 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
              <div className="w-full whitespace-nowrap md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-8 bg-neutral-950">
                <div className="max-w-lg animate-float">
                  <span className="text-neutral-400 tracking-wider text-sm font-mono">
                    {section.subtitle.split('\n').map((text, index) => (
                      <span key={index}>
                        {text}
                        <br />
                      </span>
                    ))}
                  </span>
                  <h2 className="mt-4 leading-none bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-5xl md:text-7xl font-bold text-transparent">
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
              <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 bg-neutral-950 flex items-center justify-center whitespace-nowrap">
                <div className="max-w-lg animate-float">
                  <span className="text-neutral-400 tracking-wider text-sm font-mono">
                    {section.subtitle.split('\n').map((text, index) => (
                      <span key={index}>
                        {text}
                        <br />
                      </span>
                    ))}
                  </span>
                  <h2 className="mt-4 leading-none bg-gradient-to-r from-white to-neutral-400 text-5xl md:text-7xl font-bold bg-clip-text text-transparent">
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
              <div className="group relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-neutral-950/70 before:to-neutral-950/50 before:transition-opacity before:duration-500 hover:before:opacity-0">
                <Image
                  src={section.imageUrl}
                  alt={section.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover saturate-150 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
            </>
          )}
        </section>
      ))}
      <div className="absolute z-50 right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'bg-white scale-150'
                : 'bg-white/20 hover:bg-white hover:scale-150'
            }`}
            title={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function useIntersection(ref: React.RefObject<HTMLDivElement>) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && scrollDirection === 'down') {
          setIsVisible(true);
        } else if (!entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, scrollDirection]);

  return isVisible;
}
function ReviewCards() {
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

      <div className="pt-20 flex gap-4">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`w-[25%] h-[20rem] p-4 bg-black rounded-xl flex flex-col justify-between transition-all duration-1000 ease-out
              ${index % 2 === 0 ? 'translate-y-4' : 'translate-y-24'}
                  ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-[20rem]'
                  }`}
          >
            <div className="flex flex-col">
              <span className="text-gray-400">{review.rating}</span>
              <span className="text-xl font-pretendard font-bold text-gray-300 hover:text-main transition duration-200 ease-in">
                {review.content}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-white text-xl">{review.imageUrl}</span>
              <span className="text-mainLanding font-bold text-xl">
                {review.user}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Contactme() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersection(ref);

  return (
    <div
      ref={ref}
      className={`${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[15rem]'} w-full max-w-[80rem] mx-auto px-10 sm:px-16 md:px-20 lg:px-24 xl:px-32 flex flex-col gap-4 transition-all duration-1000 ease-out`}
    >
      <span className="bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-5xl max-lg:text-4xl max-md:text-2xl max-sm:text-lg font-pretendard font-bold text-transparent max-lg:text-shadow-none">
        Contact me<span className="text-main">.</span>
      </span>
      <div className="flex gap-6 justify-between">
        <div className="w-[50%] h-[10rem] p-4 rounded-xl bg-gray-800 flex flex-col justify-center">
          <div className="flex justify-between">
            <span className="text-2xl font-pretendard font-bold text-white">
              피드백을 들려주세요
            </span>
            <button
              className="text-white"
              onClick={() => window.open('mailto:cwl64658@gmail.com', '_blank')}
            >
              <span className="text-4xl font-pretendard font-bold text-white">
                ↗
              </span>
            </button>
          </div>
          <span className="text-[1rem] font-bold text-mainLanding hover:text-gray-200 transition-colors duration-300">
            cwl64658@gmail.com
          </span>
        </div>
        <div className="w-[50%] h-[10rem] p-4 bg-gray-800 rounded-xl flex flex-col justify-center">
          <div className="flex justify-between">
            <span className="text-2xl font-pretendard font-bold text-white">
              유튜브 보기
            </span>
            <button
              className="text-white"
              onClick={() =>
                window.open(
                  'https://www.youtube.com/watch?v=7vk0clfjUh4',
                  '_blank',
                )
              }
            >
              <span className="text-4xl font-pretendard font-bold text-white">
                ↗
              </span>
            </button>
          </div>
          <span className="text-[1rem] font-bold text-mainLanding hover:text-gray-200 transition-colors duration-300">
            카페 마스터즈를 어떻게 사용하는지 알려드려요
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen max-w-screen overflow-hidden">
      <Navbar />
      {/* 1st Section 중첩 모션 카드 */}
      <section className="w-full h-[60rem] bg-cover bg-center bg-main_light">
        <ScrollSections />
      </section>

      {/* 2nd Section 사용자들의 리뷰 카드 */}
      <section className="w-full h-[60rem] pt-60 bg-gray-100">
        <ReviewCards />
      </section>

      {/* 3rd Section Contact Us */}
      <section className="w-full h-[30rem] pt-32 bg-black">
        <Contactme />
      </section>
    </main>
  );
}
