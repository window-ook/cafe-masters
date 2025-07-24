import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-main-super-dark via-main-dark to-main bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-main/20 backdrop-blur-sm border border-main/30 rounded-full text-main-light text-sm font-medium">
            ☕ 100+ 카페 수집됨
          </span>
        </div>
        <h1 className="text-6xl max-lg:text-5xl max-md:text-4xl max-sm:text-3xl font-bold text-white mb-6 leading-tight">
          카페 컬렉션의 새로운 경험을
          <br />
          <span className="bg-gradient-to-r from-main-light to-main bg-clip-text text-transparent">
            시작하세요
          </span>
        </h1>
        <p className="text-xl max-md:text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
          나만의 카페 카드를 수집하고, 가고 싶은 곳을 북마크하며,
          <br />
          개발자가 직접 추천하는 카페를 찾아보세요.
        </p>
        <div className="flex gap-4 justify-center max-sm:flex-col max-sm:items-center">
          <Link
            href="/main"
            className="glass-card px-8 py-4 bg-main hover:bg-main-dark text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            컬렉션 시작하기
          </Link>
          <button className="glass-card-secondary px-8 py-4 border border-main/30 text-main-light font-bold rounded-xl transition-all duration-300 hover:-translate-y-1">
            데모 보기
          </button>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: '📚',
      title: '카페 수집',
      description: '갔던 카페를 카드로 수집하고 나만의 컬렉션을 완성하세요',
      category: '수집',
      rating: '⭐ 4.8',
    },
    {
      id: 2,
      icon: '🔖',
      title: '북마크하기',
      description: '가고 싶은 카페를 저장하고 언제든지 쉽게 찾아보세요',
      category: '저장',
      rating: '⭐ 4.9',
    },
    {
      id: 3,
      icon: '🎯',
      title: '추천 리스트',
      description: '개발자가 엄선한 카페와 필터링으로 원하는 곳을 찾으세요',
      category: '추천',
      rating: '⭐ 4.7',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl max-md:text-3xl font-bold text-gray-900 mb-4">
            주요 기능
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            카페 마스터즈의 핵심 기능들로 더 나은 카페 경험을 만들어보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="glass-card p-8 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{feature.icon}</span>
                <div>
                  <span className="inline-block px-3 py-1 bg-main/10 text-main text-sm font-medium rounded-full">
                    {feature.category}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">{feature.rating}</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-main transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>
              <button className="w-full py-3 px-6 bg-main/10 hover:bg-main hover:text-white text-main font-medium rounded-xl transition-all duration-300">
                자세히 보기
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const benefits = [
    {
      icon: '👨‍💻',
      title: '개발자가 만든 서비스',
      description: '실제 카페를 자주 이용하는 개발자가 직접 만든 서비스입니다',
    },
    {
      icon: '🏆',
      title: '컬렉션 달성 배지',
      description: '다양한 카페를 수집하면서 특별한 배지와 등급을 획득하세요',
    },
    {
      icon: '💬',
      title: '빠른 커뮤니티 지원',
      description: '궁금한 점이 있으시면 언제든지 커뮤니티에서 도움을 받으세요',
    },
    {
      icon: '🔄',
      title: '실시간 업데이트',
      description: '새로운 카페 정보와 기능이 실시간으로 업데이트됩니다',
    },
    {
      icon: '🌟',
      title: '프리미엄 경험',
      description: '광고 없는 깔끔한 인터페이스로 최상의 사용 경험을 제공합니다',
    },
    {
      icon: '📱',
      title: '모든 기기에서 접근',
      description: 'PC, 태블릿, 모바일 어떤 기기에서든 편리하게 사용하세요',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-main font-semibold text-lg">놀라운 혜택들</span>
          <h2 className="text-4xl max-md:text-3xl font-bold text-gray-900 mb-4 mt-2">
            카페 마스터즈만의 특별한 경험
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            다른 서비스에서는 경험할 수 없는 카페 마스터즈만의 독특한 장점들을 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-main/10 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-main/20 transition-colors">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-main transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategorySection = () => {
  const categories = [
    {
      title: '스터디 카페',
      description: '조용하고 집중하기 좋은 공간의 카페들을 찾아보세요',
      icon: '📖',
    },
    {
      title: '디저트 카페',
      description: '맛있는 디저트와 함께 즐길 수 있는 카페들',
      icon: '🧁',
    },
    {
      title: '뷰 카페',
      description: '아름다운 경치를 감상하며 커피를 마실 수 있는 곳',
      icon: '🌅',
    },
    {
      title: '브런치 카페',
      description: '든든한 브런치 메뉴가 있는 카페들',
      icon: '🥐',
    },
    {
      title: '로스터리',
      description: '직접 로스팅하는 원두로 진짜 커피맛을 느껴보세요',
      icon: '☕',
    },
    {
      title: '펫 카페',
      description: '반려동물과 함께 갈 수 있는 카페들',
      icon: '🐕',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl max-md:text-3xl font-bold text-gray-900 mb-4">
            카테고리별 카페 탐색
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            원하는 분위기와 목적에 맞는 카페를 카테고리별로 쉽게 찾아보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-main/10 rounded-xl flex items-center justify-center text-2xl group-hover:bg-main/20 transition-colors">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-main transition-colors">
                  {category.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/cafe"
            className="inline-block px-8 py-4 bg-main hover:bg-main-dark text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-1"
          >
            모든 카테고리 보기
          </Link>
        </div>
      </div>
    </section>
  );
};

const StatisticsSection = () => {
  const stats = [
    {
      number: '5,000+',
      label: '수집된 카페',
    },
    {
      number: '1,200+',
      label: '활성 사용자',
    },
    {
      number: '15+',
      label: '카페 카테고리',
    },
    {
      number: '4.8',
      label: '사용자 만족도',
    },
  ];

  return (
    <section className="py-20 bg-main-dark text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl max-md:text-3xl font-bold mb-4">
            카페 마스터즈 현황
          </h2>
          <p className="text-xl text-main-light max-w-2xl mx-auto">
            지난 1년간 전 세계 사용자들과 함께 만들어낸 놀라운 성과들입니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl max-md:text-4xl font-bold text-main-light mb-2">
                {stat.number}
              </div>
              <div className="text-xl text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-main to-main-dark text-white">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-5xl max-md:text-4xl font-bold mb-6">
          카페 마스터가 될 준비가 되셨나요?
        </h2>
        <p className="text-xl mb-8 text-main-super-light leading-relaxed">
          지금 시작해서 나만의 카페 컬렉션을 만들고,
          <br />
          새로운 카페 경험의 세계로 떠나보세요.
        </p>
        <Link
          href="/signin"
          className="inline-block px-12 py-4 bg-white text-main font-bold text-xl rounded-xl hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          지금 시작하기
        </Link>
      </div>
    </section>
  );
};

const Contactme = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-10 sm:px-16 md:px-20 lg:px-24 xl:px-32 flex flex-col gap-4 transition-all duration-1000 ease-out">
      <span className="bg-linear-to-r from-white to-neutral-400 bg-clip-text text-5xl max-lg:text-4xl max-md:text-2xl max-sm:text-lg font-pretendard font-bold text-transparent max-lg:text-shadow-none">
        Contact me<span className="text-main">.</span>
      </span>
      <div className="flex gap-6 justify-between">
        <div className="w-[50%] h-40 p-4 rounded-xl bg-gray-800 flex flex-col justify-center">
          <div className="flex justify-between">
            <span className="text-2xl max-[690px]:text-xl max-[560px]:text-xs font-pretendard font-bold text-white">
              피드백을 들려주세요
            </span>
            <button
              type="button"
              aria-label="피드백 메일 발송하기 버튼"
              className="text-white"
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
        <div className="w-[50%] h-40 p-4 bg-gray-800 rounded-xl flex flex-col justify-center">
          <div className="flex justify-between">
            <span className="text-2xl max-[690px]:text-xl max-[560px]:text-xs font-pretendard font-bold text-white">
              데모 시청하기
            </span>
            <button
              type="button"
              aria-label="카페 마스터즈 데모 영상 링크 버튼"
              className="text-white"
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
    <div className="w-full min-h-screen overflow-y-auto">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CategorySection />
      <StatisticsSection />
      <CTASection />
      <section className="w-full py-32 bg-black">
        <Contactme />
      </section>
    </div>
  );
}
