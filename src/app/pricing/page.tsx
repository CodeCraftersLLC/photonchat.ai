import { Navbar } from '@/components/navbar';
import { PricingSection } from '@/features/pricing/components/pricing-section';

export default function PricingPage() {
  return (
    <div className="gradient-bg">
      <Navbar />
      <PricingSection isPricingPage />
    </div>
  );
}
