import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ContactShadows } from '@react-three/drei';
import { createNoise3D } from 'simplex-noise';
import { usePresence } from 'motion/react';

const noise3D = createNoise3D();

export type BlobVariant = 'agents' | 'music' | 'speech' | 'cloning' | 'developer';

interface BlobProps {
  variant?: BlobVariant;
}

const VARIANTS = {
  agents: {
    color: new THREE.Color('#002266'),
    emissive: new THREE.Color('#001144'),
    points: new THREE.Color('#88ddff'),
    shadow: '#0044ff',
    noiseAmp: 0.1,
    ridgeAmp: 0.02,
    speed: 0.2,
  },
  music: {
    color: new THREE.Color('#4a0066'),
    emissive: new THREE.Color('#220044'),
    points: new THREE.Color('#ff88dd'),
    shadow: '#8800ff',
    noiseAmp: 0.35,
    ridgeAmp: 0.08,
    speed: 0.6,
  },
  speech: {
    color: new THREE.Color('#006622'),
    emissive: new THREE.Color('#004411'),
    points: new THREE.Color('#88ffaa'),
    shadow: '#00ff44',
    noiseAmp: 0.1,
    ridgeAmp: 0.02,
    speed: 0.2,
  },
  cloning: {
    color: new THREE.Color('#662200'),
    emissive: new THREE.Color('#441100'),
    points: new THREE.Color('#ffaa88'),
    shadow: '#ff4400',
    noiseAmp: 0.25,
    ridgeAmp: 0.06,
    speed: 0.4,
  },
  developer: {
    color: new THREE.Color('#111827'),
    emissive: new THREE.Color('#374151'),
    points: new THREE.Color('#3b82f6'),
    shadow: '#9ca3af',
    noiseAmp: 0.15,
    ridgeAmp: 0.04,
    speed: 0.3,
  }
};

export default function Blob({ variant = 'agents' }: BlobProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerGroupRef = useRef<THREE.Group>(null);
  const meshGeoRef = useRef<THREE.SphereGeometry>(null);
  const pointsGeoRef = useRef<THREE.SphereGeometry>(null);
  const meshMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const pointsMatRef = useRef<THREE.PointsMaterial>(null);
  const shadowRef = useRef<any>(null);

  const [isPresent, safeToRemove] = usePresence();
  const enterProgress = useRef(0);
  const exitProgress = useRef(0);

  // Target values for smooth transitions
  const targetParams = useRef({ ...VARIANTS[variant] });

  useEffect(() => {
    targetParams.current = { ...VARIANTS[variant] };
  }, [variant]);

  // Higher resolution for the dense dot pattern
  const originalPositions = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.8, 128, 128);
    return geo.attributes.position.clone();
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime() * targetParams.current.speed;
    
    // Animation logic for enter/exit
    if (isPresent) {
      enterProgress.current = THREE.MathUtils.damp(enterProgress.current, 1, 10, delta);
    } else {
      exitProgress.current = THREE.MathUtils.damp(exitProgress.current, 1, 10, delta);
      if (exitProgress.current > 0.99) {
        safeToRemove?.();
      }
    }

    const currentY = THREE.MathUtils.lerp(-2, 0, enterProgress.current) + THREE.MathUtils.lerp(0, 2, exitProgress.current);
    const currentOpacity = enterProgress.current * (1 - exitProgress.current);

    if (outerGroupRef.current) {
      outerGroupRef.current.position.y = currentY;
    }

    if (meshMatRef.current) {
      meshMatRef.current.transparent = true;
      meshMatRef.current.opacity = currentOpacity;
    }
    if (pointsMatRef.current) {
      pointsMatRef.current.transparent = true;
      pointsMatRef.current.opacity = currentOpacity * 0.8;
    }
    if (shadowRef.current) {
      // shadowRef.current is the group, we need to find the mesh inside
      shadowRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = currentOpacity * 0.4;
        }
      });
    }

    // Smoothly interpolate colors
    if (meshMatRef.current && pointsMatRef.current) {
      meshMatRef.current.color.lerp(targetParams.current.color, delta * 2);
      meshMatRef.current.emissive.lerp(targetParams.current.emissive, delta * 2);
      pointsMatRef.current.color.lerp(targetParams.current.points, delta * 2);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5;
      groupRef.current.rotation.z = t * 0.2;
    }

    if (meshGeoRef.current && pointsGeoRef.current) {
      const meshPos = meshGeoRef.current.attributes.position;
      const pointsPos = pointsGeoRef.current.attributes.position;

      // Smoothly interpolate shape parameters
      // We store current animated values on the ref to lerp them
      if (!(targetParams.current as any).currentNoiseAmp) {
        (targetParams.current as any).currentNoiseAmp = targetParams.current.noiseAmp;
        (targetParams.current as any).currentRidgeAmp = targetParams.current.ridgeAmp;
      }
      
      (targetParams.current as any).currentNoiseAmp = THREE.MathUtils.lerp(
        (targetParams.current as any).currentNoiseAmp,
        targetParams.current.noiseAmp,
        delta * 2
      );
      
      (targetParams.current as any).currentRidgeAmp = THREE.MathUtils.lerp(
        (targetParams.current as any).currentRidgeAmp,
        targetParams.current.ridgeAmp,
        delta * 2
      );

      const currentNoiseAmp = (targetParams.current as any).currentNoiseAmp;
      const currentRidgeAmp = (targetParams.current as any).currentRidgeAmp;

      for (let i = 0; i < meshPos.count; i++) {
        const x = originalPositions.getX(i);
        const y = originalPositions.getY(i);
        const z = originalPositions.getZ(i);

        // Normalize position for noise sampling
        const len = Math.sqrt(x*x + y*y + z*z);
        const nx = x / len;
        const ny = y / len;
        const nz = z / len;

        // Domain warping for swirling, rose-like folds
        const warpX = noise3D(nx * 1.5 + t, ny * 1.5, nz * 1.5);
        const warpY = noise3D(nx * 1.5, ny * 1.5 + t, nz * 1.5);
        const warpZ = noise3D(nx * 1.5, ny * 1.5, nz * 1.5 + t);

        // Main shape distortion
        const n1 = noise3D(nx * 2.0 + warpX * 0.5, ny * 2.0 + warpY * 0.5, nz * 2.0 + warpZ * 0.5);
        
        // Secondary high-frequency ridges
        const n2 = Math.abs(noise3D(nx * 2.0 - t, ny * 2.0, nz * 2.0 + t));

        // Combine: large smooth folds + sharp valleys
        const distort = 1 + (n1 * currentNoiseAmp) - (n2 * currentRidgeAmp);

        const dx = nx * len * distort;
        const dy = ny * len * distort;
        const dz = nz * len * distort;

        meshPos.setXYZ(i, dx, dy, dz);
        // Points sit slightly outside the mesh
        pointsPos.setXYZ(i, dx * 1.005, dy * 1.005, dz * 1.005);
      }

      meshPos.needsUpdate = true;
      pointsPos.needsUpdate = true;
      meshGeoRef.current.computeVertexNormals();
    }
  });

  return (
    <group ref={outerGroupRef}>
      <group>
        <group ref={groupRef}>
          {/* Deep blue glowing core */}
          <mesh>
            <sphereGeometry ref={meshGeoRef} args={[1.8, 128, 128]} />
            <meshPhysicalMaterial
              ref={meshMatRef}
              color={VARIANTS[variant].color}
              emissive={VARIANTS[variant].emissive}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
              transmission={0.9}
              thickness={2.0}
              clearcoat={1}
              clearcoatRoughness={0.1}
              ior={1.5}
              transparent={true}
              opacity={0}
            />
          </mesh>
          
          {/* Dense bright cyan/white dotted surface */}
          <points>
            <sphereGeometry ref={pointsGeoRef} args={[1.8, 128, 128]} />
            <pointsMaterial
              ref={pointsMatRef}
              color={VARIANTS[variant].points}
              size={0.015}
              transparent={true}
              opacity={0}
              sizeAttenuation={true}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
        </group>

        <ContactShadows
          ref={shadowRef}
          position={[0, -2.8, 0]}
          opacity={0}
          scale={12}
          blur={2.5}
          far={4}
          color={VARIANTS[variant].shadow}
        />
      </group>
    </group>
  );
}
