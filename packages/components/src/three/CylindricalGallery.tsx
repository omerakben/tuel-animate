import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { cn } from '@tuel/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ImageBlock {
  id: number;
  texture: THREE.Texture | null;
  geometry: THREE.BufferGeometry;
  material: THREE.MeshPhongMaterial;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

interface CylindricalGallerySceneProps {
  images: string[];
  scrollProgress: number;
}

function CylindricalGalleryScene({ images, scrollProgress }: CylindricalGallerySceneProps) {
  const galleryGroupRef = useRef<THREE.Group>(null);
  const [blocks, setBlocks] = useState<ImageBlock[]>([]);
  const rotationSpeedRef = useRef(0);
  const baseRotationSpeed = 0.0025;

  const { camera } = useThree();

  // Create curved plane geometry
  const createCurvedPlane = useCallback(
    (width: number, height: number, radius: number, segments: number) => {
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      const uvs: number[] = [];

      const segmentsX = segments * 4;
      const segmentsY = Math.floor(height * 12);
      const theta = width / radius;

      for (let y = 0; y <= segmentsY; y++) {
        const yPos = (y / segmentsY - 0.5) * height;
        for (let x = 0; x <= segmentsX; x++) {
          const xAngle = (x / segmentsX - 0.5) * theta;
          const xPos = Math.sin(xAngle) * radius;
          const zPos = Math.cos(xAngle) * radius;
          vertices.push(xPos, yPos, zPos);

          uvs.push((x / segmentsX) * 0.8 + 0.1, y / segmentsY);
        }
      }

      for (let y = 0; y < segmentsY; y++) {
        for (let x = 0; x < segmentsX; x++) {
          const a = x + (segmentsX + 1) * y;
          const b = x + (segmentsX + 1) * (y + 1);
          const c = x + 1 + (segmentsX + 1) * (y + 1);
          const d = x + 1 + (segmentsX + 1) * y;
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      return geometry;
    },
    []
  );

  // Load images and create blocks
  useEffect(() => {
    if (images.length === 0) return;

    const radius = 6;
    const height = 30;
    const numVerticalSections = 12;
    const blocksPerSection = 4;
    const verticalSpacing = 3.25;

    const totalBlockHeight = numVerticalSections * verticalSpacing;
    const heightBuffer = (height - totalBlockHeight) / 2;
    const startY = -height / 2 + heightBuffer + verticalSpacing;

    const sectionAngle = (Math.PI * 2) / blocksPerSection;
    const maxRandomAngle = sectionAngle * 0.3;

    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;
    const newBlocks: ImageBlock[] = [];

    const createBlock = (section: number, blockIndex: number, imageUrl: string) => {
      const blockGeometry = createCurvedPlane(5, 3, radius, 10);
      const baseY = startY + section * verticalSpacing;
      const yOffset = Math.random() * 0.2 - 0.1;

      const baseAngle = sectionAngle * blockIndex;
      const randomAngleOffset = (Math.random() * 2 - 1) * maxRandomAngle;
      const finalAngle = baseAngle + randomAngleOffset;

      const blockMaterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        toneMapped: false,
      });

      const block: ImageBlock = {
        id: section * blocksPerSection + blockIndex,
        texture: null,
        geometry: blockGeometry,
        material: blockMaterial,
        position: { x: 0, y: baseY + yOffset, z: 0 },
        rotation: { x: 0, y: finalAngle, z: 0 },
      };

      // Load texture
      textureLoader.load(
        imageUrl,
        (texture) => {
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          block.texture = texture;
          block.material.map = texture;
          block.material.needsUpdate = true;

          loadedCount++;
        },
        undefined,
        () => {
          loadedCount++;
        }
      );

      return block;
    };

    // Create blocks
    for (let section = 0; section < numVerticalSections; section++) {
      for (let i = 0; i < blocksPerSection; i++) {
        const imageIndex = (section * blocksPerSection + i) % images.length;
        const block = createBlock(section, i, images[imageIndex]);
        newBlocks.push(block);
      }
    }

    setBlocks(newBlocks);

    return () => {
      // Cleanup
      newBlocks.forEach((block) => {
        block.geometry.dispose();
        block.material.dispose();
        if (block.texture) {
          block.texture.dispose();
        }
      });
    };
  }, [images, createCurvedPlane]);

  // Update camera position based on scroll
  useEffect(() => {
    const height = 30;
    const targetY = scrollProgress * height - height / 2;
    camera.position.y = -targetY;
  }, [scrollProgress, camera]);

  // Animation loop
  useFrame(() => {
    if (galleryGroupRef.current) {
      galleryGroupRef.current.rotation.y += baseRotationSpeed + rotationSpeedRef.current;
      rotationSpeedRef.current *= 0.92; // Damping
    }
  });

  // Handle scroll velocity
  useEffect(() => {
    const handleScroll = () => {
      // Simple velocity approximation
      rotationSpeedRef.current = Math.min(
        Math.abs(window.scrollY - (window.scrollY || 0)) * 0.001,
        0.05
      );
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Setup camera position
  useEffect(() => {
    camera.position.set(0, 0, 12);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={1} />

      <group ref={galleryGroupRef}>
        {/* Invisible cylinder for reference */}
        <mesh>
          <cylinderGeometry args={[6, 6, 30, 30, 1, true]} />
          <meshPhongMaterial color={0xffffff} transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>

        {/* Render blocks */}
        {blocks.map((block) => (
          <group
            key={block.id}
            position={[block.position.x, block.position.y, block.position.z]}
            rotation={[block.rotation.x, block.rotation.y, block.rotation.z]}
          >
            <mesh geometry={block.geometry} material={block.material} />
          </group>
        ))}
      </group>
    </>
  );
}

export interface CylindricalGalleryProps {
  className?: string;
  images?: string[];
  backgroundColor?: string;
}

const defaultImages = [
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1534996858221-380b92700493?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1520637836862-4d197d17c30a?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1534996858221-380b92700493?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1520637836862-4d197d17c30a?w=800&h=600&fit=crop',
];

export function CylindricalGallery({
  className,
  images = defaultImages,
  backgroundColor = '#000000',
}: CylindricalGalleryProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn('w-full h-full relative', className)}>
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        style={{ background: backgroundColor }}
      >
        <CylindricalGalleryScene images={images} scrollProgress={scrollProgress} />
      </Canvas>

      {/* Navigation overlay */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-6 text-white">
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Silhouette</p>
          <p className="text-sm opacity-70">
            Microfolio <br />
            2017 - Ongoing
          </p>
        </div>
        <div className="flex flex-col">
          <p className="hover:opacity-70 transition-opacity cursor-pointer">Info</p>
        </div>
      </nav>

      <footer className="absolute bottom-0 left-0 right-0 z-10 flex justify-between items-center p-6 text-white text-sm">
        <p>3D Gallery Experiment</p>
        <p>By Tuel Animate</p>
      </footer>

      {/* Scroll content to enable scrolling */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-[500vh]" />
      </div>
    </div>
  );
}
