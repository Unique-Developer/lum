"use client";

import { usePathname } from "next/navigation";
import { Preloader } from "@/components/ui/Preloader";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { LightRays } from "@/components/ui/LightRays";
import { ScrollDimming } from "@/components/ui/ScrollDimming";
import { PageTransition } from "./PageTransition";

interface UniqueFeaturesProviderProps {
  children: React.ReactNode;
}

export function UniqueFeaturesProvider({ children }: UniqueFeaturesProviderProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      <Preloader />
      {!isAdmin && (
        <>
          <CursorGlow />
          <LightRays />
          <ScrollDimming />
        </>
      )}
      <PageTransition>{children}</PageTransition>
    </>
  );
}
