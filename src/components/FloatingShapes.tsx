import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

export default function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.rotation.z = t * 0.05;
    }
  });

  const materialProps = {
    roughness: 0.1,
    metalness: 0.8,
    transmission: 0.9,
    thickness: 2.0,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    ior: 1.5,
  };

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={2} floatIntensity={2} position={[4, 1, -2]}>
        <mesh>
          <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
          <meshPhysicalMaterial 
            {...materialProps} 
            color="#a855f7" 
            emissive="#4c1d95" 
            emissiveIntensity={0.5} 
          />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={3} position={[-4, -1, -1]}>
        <mesh>
          <icosahedronGeometry args={[1.8, 0]} />
          <meshPhysicalMaterial 
            {...materialProps} 
            color="#3b82f6" 
            emissive="#1e3a8a" 
            emissiveIntensity={0.5} 
          />
        </mesh>
      </Float>
      
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5} position={[0, -3, 1]}>
        <mesh>
          <octahedronGeometry args={[1.5, 0]} />
          <meshPhysicalMaterial 
            {...materialProps} 
            color="#ec4899" 
            emissive="#831843" 
            emissiveIntensity={0.5} 
          />
        </mesh>
      </Float>
    </group>
  );
}
