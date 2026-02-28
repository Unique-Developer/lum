"use client";

import { Canvas } from "@react-three/fiber";
import { LegacyScene } from "./LegacyScene";

interface Legacy3DCanvasProps {
  scrollProgress: number;
}

export function Legacy3DCanvas({ scrollProgress }: Legacy3DCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      className="absolute inset-0"
    >
      <LegacyScene scrollProgress={scrollProgress} />
    </Canvas>
  );
}
