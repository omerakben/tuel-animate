import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, MeshDistortMaterial } from '@react-three/drei';
import { cn } from '@tuel/utils';

export interface FloatingObjectProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
  shape?: 'sphere' | 'box' | 'torus' | 'cone' | 'dodecahedron' | 'octahedron';
  wireframe?: boolean;
  metalness?: number;
  roughness?: number;
  distort?: number;
  speed?: number;
  floatIntensity?: number;
  rotationSpeed?: number;
}

function FloatingObject({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#8b5cf6',
  shape = 'sphere',
  wireframe = false,
  metalness = 0.1,
  roughness = 0.1,
  distort = 0.3,
  speed = 2,
  floatIntensity = 1,
  rotationSpeed = 1,
}: FloatingObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Get geometry based on shape
  const geometry = useMemo(() => {
    switch (shape) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.3, 16, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.6, 1, 32]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.8]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.8]} />;
      default:
        return <sphereGeometry args={[0.8, 32, 32]} />;
    }
  }, [shape]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.001 * rotationSpeed;
    meshRef.current.rotation.y += 0.002 * rotationSpeed;
  });

  return (
    <Float
      speed={speed}
      rotationIntensity={rotationSpeed}
      floatIntensity={floatIntensity}
    >
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={scale}
        castShadow
      >
        {geometry}
        {distort > 0 ? (
          <MeshDistortMaterial
            color={color}
            wireframe={wireframe}
            metalness={metalness}
            roughness={roughness}
            distort={distort}
            speed={speed}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            wireframe={wireframe}
            metalness={metalness}
            roughness={roughness}
          />
        )}
      </mesh>
    </Float>
  );
}

export interface FloatingObjectsProps {
  className?: string;
  objects?: FloatingObjectProps[];
  backgroundColor?: string;
  fog?: boolean;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  shadows?: boolean;
  environment?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
  ambientIntensity?: number;
  cameraPosition?: [number, number, number];
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

export function FloatingObjects({
  className,
  objects = [
    { position: [-2, 0, 0], color: '#8b5cf6', shape: 'sphere' },
    { position: [0, 0, 0], color: '#3b82f6', shape: 'box' },
    { position: [2, 0, 0], color: '#ec4899', shape: 'torus' },
  ],
  backgroundColor = '#1a1a2e',
  fog = true,
  fogColor = '#1a1a2e',
  fogNear = 5,
  fogFar = 15,
  shadows = true,
  environment = 'sunset',
  ambientIntensity = 0.5,
  cameraPosition = [0, 0, 5],
  autoRotate = true,
  autoRotateSpeed = 0.5,
}: FloatingObjectsProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <Canvas
        shadows={shadows}
        camera={{ position: cameraPosition, fov: 75 }}
        style={{ background: backgroundColor }}
      >
        {fog && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}
        
        <ambientLight intensity={ambientIntensity} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {environment && <Environment preset={environment} />}
        
        {objects.map((obj, index) => (
          <FloatingObject key={index} {...obj} />
        ))}
        
        {shadows && (
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
        )}
      </Canvas>
    </div>
  );
}