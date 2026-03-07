"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PRIMARY_COLOR = "#114f75";
const SOFT_GLOW = "#58b1d9";

export function LuminArtBeamScene() {
  const beamsRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (beamsRef.current) {
      beamsRef.current.rotation.y = Math.sin(timeRef.current * 0.3) * 0.1;
    }
  });

  // Abstract light beams - arranged to suggest brand presence
  const beamCount = 12;
  const beams = Array.from({ length: beamCount }, (_, i) => {
    const angle = (i / beamCount) * Math.PI * 1.5 - Math.PI * 0.4;
    const radius = 2 + Math.sin(i * 0.7) * 0.5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const length = 1.5 + Math.sin(i * 0.5) * 0.5;
    const tilt = 0.3 + (i % 3) * 0.1;
    return { position: [x, 0.5, z] as [number, number, number], length, tilt };
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 5, 5]} intensity={0.6} />
      <pointLight
        position={[0, 0, 2]}
        color={SOFT_GLOW}
        intensity={1.5}
        decay={2}
        distance={6}
      />

      <group ref={beamsRef} position={[0, 0, -1]}>
        {beams.map((b, i) => (
          <mesh
            key={i}
            position={b.position}
            rotation={[-b.tilt, 0, 0]}
          >
            <cylinderGeometry args={[0.02, 0.06, b.length, 6]} />
            <meshStandardMaterial
              color={PRIMARY_COLOR}
              emissive={SOFT_GLOW}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
        {/* Central glow sphere - focal point */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshBasicMaterial
            color={SOFT_GLOW}
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>
    </>
  );
}
