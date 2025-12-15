import FeatureSection from '@/components/landing/FeatureSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import CategorySection from '@/components/landing/CategorySection';
import CheckSection from '@/components/landing/CheckSection';
import HeroSection from '@/components/landing/HeroSection';
import GallerySection from '@/components/landing/GallerySection';
import FooterSection from '@/components/landing/FooterSection';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-transparent text-white">
      <HeroSection />
      <FeatureSection />
      <GallerySection />
      <BenefitsSection />
      <CategorySection />
      <CheckSection />
      <FooterSection />
    </div>
  );
};