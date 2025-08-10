import { Suspense, useRef, ReactNode } from 'react';
import { OrbitControls, PerspectiveCamera, Environment, Preload } from '@react-three/drei';
import { Group } from 'three';
import { ClientOnly, R3FCanvas } from '@tuel/three';
import { cn } from '@tuel/utils';

export interface ThreeOrbitSceneProps {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  environment?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
  environmentIntensity?: number;
  fallback?: ReactNode;
  onLoad?: () => void;
  shadows?: boolean;
}

function OrbitSceneContent({
  children,
  cameraPosition = [0, 0, 5],
  cameraFov = 50,
  enableZoom = true,
  enablePan = true,
  enableRotate = true,
  autoRotate = false,
  autoRotateSpeed = 1,
  environment = 'studio',
  onLoad,
  shadows = false,
}: Omit<ThreeOrbitSceneProps, 'className' | 'fallback'>) {
  const groupRef = useRef<Group>(null);

  return (
    <R3FCanvas shadows={shadows} onCreated={onLoad}>
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />
      
      <OrbitControls
        enableZoom={enableZoom}
        enablePan={enablePan}
        enableRotate={enableRotate}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        makeDefault
      />
      
      <Environment
        preset={environment}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow={shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <Suspense fallback={null}>
        <group ref={groupRef}>
          {children}
        </group>
      </Suspense>
      
      <Preload all />
    </R3FCanvas>
  );
}

export function ThreeOrbitScene({
  className,
  fallback = (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-gray-500">Loading 3D Scene...</div>
    </div>
  ),
  ...props
}: ThreeOrbitSceneProps) {
  return (
    <div className={cn('relative w-full h-full', className)}>
      <ClientOnly fallback={fallback}>
        <OrbitSceneContent {...props} />
      </ClientOnly>
    </div>
  );
}

// Example usage component
export function ExampleOrbitBox() {
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" metalness={0.5} roughness={0.2} />
    </mesh>
  );
}