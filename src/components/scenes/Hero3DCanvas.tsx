"use client";

import { Canvas } from "@react-three/fiber";
import { HeroScene } from "./HeroScene";

export function Hero3DCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      className="absolute inset-0"
    >
      <HeroScene />
    </Canvas>
  );
}
