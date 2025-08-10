import { MeshWobbleMaterial, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { cn } from '@tuel/utils';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface MorphingMeshProps {
  position?: [number, number, number];
  color?: string;
  morphTargets?: string[];
  morphSpeed?: number;
  wobbleSpeed?: number;
  wobbleFactor?: number;
  scale?: number;
  metalness?: number;
  roughness?: number;
  wireframe?: boolean;
}

function MorphingMesh({
  position = [0, 0, 0],
  color = '#8b5cf6',
  morphTargets = ['sphere', 'box', 'torus', 'cone'],
  morphSpeed = 0.5,
  wobbleSpeed = 1,
  wobbleFactor = 0.3,
  scale = 1,
  metalness = 0.3,
  roughness = 0.4,
  wireframe = false,
}: MorphingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentTarget, setCurrentTarget] = useState(0);
  const morphProgress = useRef(0);

  // Create geometries for morphing
  const geometries = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];

    morphTargets.forEach((target) => {
      let geo: THREE.BufferGeometry;
      switch (target) {
        case 'box':
          geo = new THREE.BoxGeometry(1.5, 1.5, 1.5, 32, 32, 32);
          break;
        case 'torus':
          geo = new THREE.TorusGeometry(1, 0.4, 32, 64);
          break;
        case 'cone':
          geo = new THREE.ConeGeometry(1, 2, 32, 32);
          break;
        case 'dodecahedron':
          geo = new THREE.DodecahedronGeometry(1.2, 2);
          break;
        case 'octahedron':
          geo = new THREE.OctahedronGeometry(1.2, 2);
          break;
        case 'tetrahedron':
          geo = new THREE.TetrahedronGeometry(1.5, 2);
          break;
        case 'icosahedron':
          geo = new THREE.IcosahedronGeometry(1.2, 2);
          break;
        default:
          geo = new THREE.SphereGeometry(1, 64, 64);
      }
      geos.push(geo);
    });

    return geos;
  }, [morphTargets]);

  // Create base geometry with morph targets
  const geometry = useMemo(() => {
    if (geometries.length === 0) return null;

    const baseGeo = geometries[0].clone();
    const positionAttribute = baseGeo.getAttribute('position');
    const vertexCount = positionAttribute.count;

    // Create morph attributes
    const morphPositions: THREE.Float32BufferAttribute[] = [];

    for (let i = 1; i < geometries.length; i++) {
      const targetGeo = geometries[i];
      const targetPos = targetGeo.getAttribute('position');

      // Ensure same vertex count
      if (targetPos.count !== vertexCount) {
        console.warn('Morph target vertex count mismatch');
        continue;
      }

      morphPositions.push(targetPos.clone() as THREE.Float32BufferAttribute);
    }

    baseGeo.morphAttributes.position = morphPositions;

    return baseGeo;
  }, [geometries]);

  // Handle morphing animation
  useFrame((state) => {
    if (!meshRef.current || !geometry) return;

    // Update morph progress
    morphProgress.current += morphSpeed * 0.01;

    if (morphProgress.current >= 1) {
      morphProgress.current = 0;
      setCurrentTarget((prev) => (prev + 1) % geometries.length);
    }

    // Apply morph targets
    const morphInfluences = meshRef.current.morphTargetInfluences;
    if (morphInfluences) {
      // Reset all influences
      for (let i = 0; i < morphInfluences.length; i++) {
        morphInfluences[i] = 0;
      }

      // Set current morph influence
      if (currentTarget < morphInfluences.length) {
        morphInfluences[currentTarget] = morphProgress.current;
      }
    }

    // Rotation
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  if (!geometry) return null;

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      geometry={geometry}
      morphTargetInfluences={new Array(geometries.length - 1).fill(0)}
    >
      <MeshWobbleMaterial
        color={color}
        speed={wobbleSpeed}
        factor={wobbleFactor}
        metalness={metalness}
        roughness={roughness}
        wireframe={wireframe}
      />
    </mesh>
  );
}

export interface MorphingShapesProps {
  className?: string;
  shapes?: MorphingMeshProps[];
  backgroundColor?: string;
  fog?: boolean;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  ambientLightIntensity?: number;
  pointLightIntensity?: number;
  pointLightPosition?: [number, number, number];
  cameraPosition?: [number, number, number];
  enableOrbitControls?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

export function MorphingShapes({
  className,
  shapes = [
    {
      position: [-3, 0, 0],
      color: '#8b5cf6',
      morphTargets: ['sphere', 'box', 'octahedron'],
    },
    {
      position: [0, 0, 0],
      color: '#3b82f6',
      morphTargets: ['box', 'torus', 'icosahedron'],
    },
    {
      position: [3, 0, 0],
      color: '#ec4899',
      morphTargets: ['cone', 'dodecahedron', 'sphere'],
    },
  ],
  backgroundColor = '#0a0a0a',
  fog = true,
  fogColor = '#0a0a0a',
  fogNear = 5,
  fogFar = 20,
  ambientLightIntensity = 0.5,
  pointLightIntensity = 1,
  pointLightPosition = [10, 10, 10],
  cameraPosition = [0, 0, 10],
  enableOrbitControls = true,
  autoRotate = true,
  autoRotateSpeed = 1,
}: MorphingShapesProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        style={{ background: backgroundColor }}
      >
        {fog && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}

        <ambientLight intensity={ambientLightIntensity} />
        <pointLight position={pointLightPosition} intensity={pointLightIntensity} />
        <pointLight
          position={[-pointLightPosition[0], -pointLightPosition[1], -pointLightPosition[2]]}
          intensity={pointLightIntensity * 0.5}
          color="#ff6b6b"
        />

        {shapes.map((shape, index) => (
          <MorphingMesh key={index} {...shape} />
        ))}

        {enableOrbitControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
          />
        )}
      </Canvas>
    </div>
  );
}
