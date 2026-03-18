import { HeroSection } from "@/components/home/HeroSection";
import { VisualProofSection } from "@/components/home/VisualProofSection";
import { LightHouseLegacySection } from "@/components/home/LightHouseLegacySection";
// import { DualBrandSection } from "@/components/home/DualBrandSection";
import { WhatIsLuminArtSection } from "@/components/home/WhatIsLuminArtSection";
import { CTASection } from "@/components/home/CTASection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ParallaxSection } from "@/components/ui/ParallaxSection";
import { getHomepageContent } from "@/lib/homepage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getHomepageContent();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection content={content.hero} />
      <VisualProofSection content={content.visualProof} />
      <LightHouseLegacySection content={content.lightHouseLegacy} />
      {/* TODO: Re-enable DualBrandSection in upcoming homepage update.
      <ParallaxSection>
        <DualBrandSection content={content.dualBrand} />
      </ParallaxSection>
      */}
      <ParallaxSection strength={0.08}>
        <WhatIsLuminArtSection content={content.whatIsLuminArt} />
      </ParallaxSection>
      <ParallaxSection strength={0.06}>
        <CTASection content={content.cta} />
      </ParallaxSection>
      <SiteFooter />
    </main>
  );
}
