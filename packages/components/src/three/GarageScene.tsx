import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { cn } from '@tuel/utils';
import { Suspense } from 'react';
import * as THREE from 'three';

// Car garage model component
function GarageModel() {
  // In a real implementation, you'd place the GLTF file in public/models/
  // For demo purposes, we'll use a placeholder or you can add the actual model
  const gltfPath = '/models/garage-scene.gltf'; // Update this path

  try {
    const { scene } = useGLTF(gltfPath);

    // Center the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    return <primitive object={scene} />;
  } catch (error) {
    // Fallback: Create a simple garage-like scene
    return (
      <group>
        {/* Floor */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#333" />
        </mesh>

        {/* Walls */}
        <mesh position={[0, 8, -25]}>
          <boxGeometry args={[100, 20, 2]} />
          <meshStandardMaterial color="#444" />
        </mesh>

        {/* Car placeholder */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[8, 3, 15]} />
            <meshStandardMaterial color="#cc8ee8" emissive="#cc8ee8" emissiveIntensity={0.2} />
          </mesh>
          {/* Wheels */}
          {[
            [-3, -1, 5],
            [3, -1, 5],
            [-3, -1, -5],
            [3, -1, -5],
          ].map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <cylinderGeometry args={[1.5, 1.5, 1]} />
              <meshStandardMaterial color="#222" />
            </mesh>
          ))}
        </group>
      </group>
    );
  }
}

// Custom lighting setup
function GarageLighting() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0} />

      {/* Main directional light */}
      <directionalLight
        color="#cc8ee8"
        intensity={1.5}
        position={[5, 5, 5]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Point lights for atmosphere */}
      <pointLight color="#ffd600" intensity={3} distance={50} decay={5} position={[4.5, 25, 25]} />

      <pointLight color="#ea00ff" intensity={1.25} decay={2} position={[-100, 65.5, 20]} />

      <pointLight
        color="#ff4c00"
        intensity={2.5}
        distance={50}
        decay={2}
        position={[10, -10, -25]}
      />

      <pointLight
        color="#ffd600"
        intensity={3}
        distance={47}
        decay={0.5}
        position={[52, -25, 25]}
      />
    </>
  );
}

export interface GarageSceneProps {
  className?: string;
  enableBloom?: boolean;
  bloomIntensity?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  enableControls?: boolean;
  cameraPosition?: [number, number, number];
  backgroundColor?: string;
}

export function GarageScene({
  className,
  enableBloom = true,
  bloomIntensity = 0.6,
  bloomRadius = 1,
  bloomThreshold = 0.1,
  enableControls = true,
  cameraPosition = [60, 10, 50],
  backgroundColor = '#151620',
}: GarageSceneProps) {
  return (
    <div className={cn('w-full h-full relative', className)}>
      <Canvas
        camera={{
          fov: 70,
          position: cameraPosition,
          near: 0.1,
          far: 1000,
        }}
        style={{ background: backgroundColor }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.75,
        }}
        shadows
      >
        <GarageLighting />

        <Suspense fallback={null}>
          <GarageModel />
        </Suspense>

        {enableControls && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={10}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          />
        )}

        {enableBloom && (
          <EffectComposer>
            <Bloom intensity={bloomIntensity} radius={bloomRadius} threshold={bloomThreshold} />
          </EffectComposer>
        )}
      </Canvas>

      {/* UI Overlay - matching original design */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 text-white">
        <div className="logo">
          <a href="#" className="text-2xl font-bold">
            The Garage
          </a>
        </div>
        <div className="nav-items flex gap-6">
          <a href="#" className="hover:text-purple-400 transition-colors">
            Services
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors">
            About
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors">
            Contact
          </a>
        </div>
      </nav>

      <footer className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white text-center">
        <p className="mb-2 text-sm opacity-80">
          Redefining the future, where raw grit meets bold style in a dystopian-inspired garage
          experience.
        </p>
        <p className="text-xs opacity-60">Made by Codegrid - Modernized with Tuel Animate</p>
      </footer>
    </div>
  );
}

// Preload the model
// useGLTF.preload('/models/garage-scene.gltf');
