import FeatureSection from '@/components/landing/FeatureSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import CategorySection from '@/components/landing/CategorySection';
import CTASection from '@/components/landing/CTASection';
import CheckSection from '@/components/landing/CheckSection';
import HeroSection from '@/components/landing/HeroSection';
import GallerySection from '@/components/landing/GallerySection';

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-y-auto">
      <HeroSection />
      <FeatureSection />
      <GallerySection />
      <BenefitsSection />
      <CategorySection />
      <CTASection />
      <CheckSection />
    </div>
  );
};