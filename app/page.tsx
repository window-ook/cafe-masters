import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection';
import GallerySection from '@/components/landing/GallerySection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import CategorySection from '@/components/landing/CategorySection';
import MoreInfoSection from '@/components/landing/MoreInfoSection';
import FooterSection from '@/components/landing/FooterSection';
import ThemeToggleButton from '@/components/shared/sidebar/ThemeToggleButton';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-y-auto bg-transparent">
      <div className="fixed z-50 top-6 right-6">
        <ThemeToggleButton />
      </div>
      <HeroSection />
      <FeatureSection />
      <GallerySection />
      <BenefitsSection />
      <CategorySection />
      <MoreInfoSection />
      <FooterSection />
    </main>
  );
};