import FeatureSection from '@/components/landing/FeatureSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import CategorySection from '@/components/landing/CategorySection';
import CTASection from '@/components/landing/CTASection';
import ContactSection from '@/components/landing/ContactSection';
import HeroSection from '@/components/landing/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-y-auto">
      <HeroSection />
      <FeatureSection />
      <BenefitsSection />
      <CategorySection />
      <CTASection />
      <ContactSection />
    </div>
  );
}