import { HeroSection } from "@/components/home/HeroSection";
import { LightHouseLegacySection } from "@/components/home/LightHouseLegacySection";
import { DualBrandSection } from "@/components/home/DualBrandSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <LightHouseLegacySection />
      <DualBrandSection />
    </main>
  );
}
