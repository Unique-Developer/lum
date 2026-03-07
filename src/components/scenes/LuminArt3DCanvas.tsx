"use client";

import { Canvas } from "@react-three/fiber";
import { LuminArtBeamScene } from "./LuminArtBeamScene";

export function LuminArt3DCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      className="absolute inset-0"
    >
      <LuminArtBeamScene />
    </Canvas>
  );
}
