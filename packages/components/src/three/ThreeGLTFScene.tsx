import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { cn } from '@tuel/utils';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

interface GLTFModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

function GLTFModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  autoRotate = false,
  autoRotateSpeed = 0.01,
}: GLTFModelProps) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += autoRotateSpeed;
    }
  });

  return (
    <group ref={modelRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  );
}

export interface ThreeGLTFSceneProps {
  className?: string;
  modelUrl: string;
  modelPosition?: [number, number, number];
  modelRotation?: [number, number, number];
  modelScale?: number | [number, number, number];
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  enableOrbitControls?: boolean;
  environment?:
    | 'sunset'
    | 'dawn'
    | 'night'
    | 'warehouse'
    | 'forest'
    | 'apartment'
    | 'studio'
    | 'city'
    | 'park'
    | 'lobby'
    | null;
  backgroundColor?: string;
  ambientIntensity?: number;
  directionalLightIntensity?: number;
  directionalLightPosition?: [number, number, number];
  shadows?: boolean;
  contactShadows?: boolean;
  contactShadowsOpacity?: number;
  contactShadowsBlur?: number;
}

export function ThreeGLTFScene({
  className,
  modelUrl,
  modelPosition = [0, 0, 0],
  modelRotation = [0, 0, 0],
  modelScale = 1,
  autoRotate = false,
  autoRotateSpeed = 0.01,
  cameraPosition = [0, 0, 5],
  cameraFov = 75,
  enableOrbitControls = true,
  environment = 'studio',
  backgroundColor = '#f0f0f0',
  ambientIntensity = 0.5,
  directionalLightIntensity = 1,
  directionalLightPosition = [10, 10, 5],
  shadows = true,
  contactShadows = true,
  contactShadowsOpacity = 0.4,
  contactShadowsBlur = 2,
}: ThreeGLTFSceneProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <Canvas
        shadows={shadows}
        camera={{ position: cameraPosition, fov: cameraFov }}
        style={{ background: backgroundColor }}
      >
        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          intensity={directionalLightIntensity}
          position={directionalLightPosition}
          castShadow={shadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {environment && <Environment preset={environment} />}

        <Suspense fallback={null}>
          <GLTFModel
            url={modelUrl}
            position={modelPosition}
            rotation={modelRotation}
            scale={modelScale}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
          />
        </Suspense>

        {contactShadows && (
          <ContactShadows
            position={[0, -1, 0]}
            opacity={contactShadowsOpacity}
            scale={10}
            blur={contactShadowsBlur}
            far={4}
          />
        )}

        {enableOrbitControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
        )}
      </Canvas>
    </div>
  );
}

// Preload the GLTFLoader
useGLTF.preload = (url: string) => useGLTF(url);
