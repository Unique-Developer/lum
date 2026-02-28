"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PRIMARY_COLOR = "#114f75";
const SOFT_GLOW = "#58b1d9";
const YEARS = [2001, 2008, 2015, 2020, 2024];

interface LegacySceneProps {
  scrollProgress: number;
}

function GlowLine({
  start,
  end,
  opacity,
}: {
  start: [number, number, number];
  end: [number, number, number];
  opacity: number;
}) {
  const length = Math.sqrt(
    Math.pow(end[0] - start[0], 2) +
      Math.pow(end[1] - start[1], 2) +
      Math.pow(end[2] - start[2], 2)
  );
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const midZ = (start[2] + end[2]) / 2;

  return (
    <mesh position={[midX, midY, midZ]} rotation={[0, 0, -Math.PI / 2]}>
      <cylinderGeometry args={[0.03, 0.03, length, 8]} />
      <meshBasicMaterial
        color={PRIMARY_COLOR}
        transparent
        opacity={opacity * 0.6}
      />
    </mesh>
  );
}

export function LegacyScene({ scrollProgress }: LegacySceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z = -scrollProgress * 4;
      groupRef.current.rotation.y = scrollProgress * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight
        position={[0, 0, 3]}
        color={SOFT_GLOW}
        intensity={1.5}
        distance={10}
      />

      <group ref={groupRef}>
        {/* Glowing connecting lines between year nodes */}
        {YEARS.slice(0, -1).map((_, i) => {
          const start = i / (YEARS.length - 1);
          const show = scrollProgress > start * 0.8;
          const alpha = show ? Math.min(1, (scrollProgress - start) * 3) : 0;

          return (
            <GlowLine
              key={i}
              start={[(i - 2) * 1.2, 0, 0]}
              end={[(i - 1) * 1.2, 0, 0]}
              opacity={alpha}
            />
          );
        })}

        {/* Year nodes */}
        {YEARS.map((year, i) => {
          const x = (i - 2) * 1.2;
          const threshold = i * 0.18;
          const scale = Math.min(1, Math.max(0.01, (scrollProgress - threshold) * 4));

          return (
            <group key={year} position={[x, 0, 0]}>
              <mesh scale={scale}>
                <sphereGeometry args={[0.15, 24, 24]} />
                <meshStandardMaterial
                  color={PRIMARY_COLOR}
                  emissive={PRIMARY_COLOR}
                  emissiveIntensity={0.6}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              <mesh scale={scale * 0.5}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial
                  color={SOFT_GLOW}
                  transparent
                  opacity={0.2}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
}
