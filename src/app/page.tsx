import { HeroSection } from "@/components/home/HeroSection";
import { LightHouseLegacySection } from "@/components/home/LightHouseLegacySection";
import { DualBrandSection } from "@/components/home/DualBrandSection";
import { WhatIsLuminArtSection } from "@/components/home/WhatIsLuminArtSection";
import { CTASection } from "@/components/home/CTASection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ParallaxSection } from "@/components/ui/ParallaxSection";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <HeroSection />
      <LightHouseLegacySection />
      <ParallaxSection>
        <DualBrandSection />
      </ParallaxSection>
      <ParallaxSection strength={0.08}>
        <WhatIsLuminArtSection />
      </ParallaxSection>
      <ParallaxSection strength={0.06}>
        <CTASection />
      </ParallaxSection>
      <SiteFooter />
    </main>
  );
}
