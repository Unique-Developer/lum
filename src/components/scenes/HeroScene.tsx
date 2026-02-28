"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PRIMARY_COLOR = "#114f75";
const SOFT_GLOW = "#58b1d9";

export function HeroScene() {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      // Subtle floating motion
      groupRef.current.position.y = Math.sin(timeRef.current * 0.5) * 0.15;
      groupRef.current.rotation.y += delta * 0.08;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(timeRef.current * 0.8) * 0.5;
    }
  });

  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />

      {/* Main accent light - soft glow */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 3]}
        color={SOFT_GLOW}
        intensity={2}
        decay={2}
        distance={8}
      />

      {/* Floating light installation - abstract geometric form */}
      <group ref={groupRef} position={[0, 0, -2]}>
        {/* Central ring - chandelier-like */}
        <mesh>
          <torusGeometry args={[0.8, 0.04, 16, 48]} />
          <meshStandardMaterial
            color={PRIMARY_COLOR}
            emissive={PRIMARY_COLOR}
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshBasicMaterial
            color={SOFT_GLOW}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Top accent - light beam suggestion */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.03, 0.08, 0.15, 8]} />
          <meshStandardMaterial
            color={PRIMARY_COLOR}
            emissive={PRIMARY_COLOR}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </>
  );
}
