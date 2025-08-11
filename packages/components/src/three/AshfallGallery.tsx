'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { cn } from '@tuel/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface AshfallGalleryProps {
  className?: string;
  images?: string[];
  numVerticalSections?: number;
  blocksPerSection?: number;
  verticalSpacing?: number;
  radius?: number;
  autoRotate?: boolean;
  baseRotationSpeed?: number;
  scrollSensitivity?: number;
  blockWidth?: number;
  blockHeight?: number;
}

// Generate random image URLs if none provided
function generateRandomImages(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/img${(i % 50) + 1}.jpg`);
}

function getRandomImageNumber(totalImages: number): number {
  return Math.floor(Math.random() * totalImages);
}

function createCurvedPlane(
  width: number,
  height: number,
  radius: number,
  segments: number
): THREE.BufferGeometry {
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
}

interface GalleryMeshProps {
  images: string[];
  numVerticalSections: number;
  blocksPerSection: number;
  verticalSpacing: number;
  radius: number;
  autoRotate: boolean;
  baseRotationSpeed: number;
  scrollSensitivity: number;
  blockWidth: number;
  blockHeight: number;
}

function GalleryMesh({
  images,
  numVerticalSections,
  blocksPerSection,
  verticalSpacing,
  radius,
  autoRotate,
  baseRotationSpeed,
  scrollSensitivity,
  blockWidth,
  blockHeight,
}: GalleryMeshProps) {
  const galleryGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const [currentScroll, setCurrentScroll] = useState(0);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [blocks, setBlocks] = useState<THREE.Group[]>([]);

  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  const height = numVerticalSections * verticalSpacing + 10;

  // Load texture with error handling
  const loadImageTexture = useCallback(
    (imagePath: string): Promise<THREE.Texture> => {
      return new Promise((resolve, reject) => {
        textureLoader.load(
          imagePath,
          (loadedTexture) => {
            loadedTexture.generateMipmaps = true;
            loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
            loadedTexture.magFilter = THREE.LinearFilter;
            resolve(loadedTexture);
          },
          undefined,
          (error) => {
            // Fallback to a colored material if image fails to load
            console.warn(`Failed to load texture: ${imagePath}`, error);
            reject(error);
          }
        );
      });
    },
    [textureLoader]
  );

  // Create individual block
  const createBlock = useCallback(
    async (baseY: number, yOffset: number, blockIndex: number): Promise<THREE.Group> => {
      const blockGeometry = createCurvedPlane(blockWidth, blockHeight, radius, 10);
      const imageIndex = getRandomImageNumber(images.length);
      const imagePath = images[imageIndex];

      let blockMaterial: THREE.Material;

      try {
        const texture = await loadImageTexture(imagePath);
        blockMaterial = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
          toneMapped: false,
        });
      } catch {
        // Fallback material with random color
        const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xfeca57, 0xff9ff3];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        blockMaterial = new THREE.MeshPhongMaterial({
          color: randomColor,
          side: THREE.DoubleSide,
          toneMapped: false,
        });
      }

      const block = new THREE.Mesh(blockGeometry, blockMaterial);
      block.position.y = baseY + yOffset;

      const blockContainer = new THREE.Group();
      const sectionAngle = (Math.PI * 2) / blocksPerSection;
      const maxRandomAngle = sectionAngle * 0.3;
      const baseAngle = sectionAngle * blockIndex;
      const randomAngleOffset = (Math.random() * 2 - 1) * maxRandomAngle;
      const finalAngle = baseAngle + randomAngleOffset;

      blockContainer.rotation.y = finalAngle;
      blockContainer.add(block);

      return blockContainer;
    },
    [images, radius, blockWidth, blockHeight, blocksPerSection, loadImageTexture]
  );

  // Initialize all blocks
  useEffect(() => {
    const initializeBlocks = async () => {
      const newBlocks: THREE.Group[] = [];
      const totalBlockHeight = numVerticalSections * verticalSpacing;
      const heightBuffer = (height - totalBlockHeight) / 2;
      const startY = -height / 2 + heightBuffer + verticalSpacing;

      for (let section = 0; section < numVerticalSections; section++) {
        const baseY = startY + section * verticalSpacing;

        for (let i = 0; i < blocksPerSection; i++) {
          const yOffset = Math.random() * 0.2 - 0.1;
          try {
            const blockContainer = await createBlock(baseY, yOffset, i);
            newBlocks.push(blockContainer);
          } catch (error) {
            console.warn('Failed to create block', error);
          }
        }
      }

      setBlocks(newBlocks);
    };

    initializeBlocks();
  }, [numVerticalSections, blocksPerSection, verticalSpacing, height, createBlock]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const newScroll = window.pageYOffset;
      const scrollDelta = newScroll - currentScroll;
      setCurrentScroll(newScroll);
      setRotationSpeed(scrollDelta * scrollSensitivity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentScroll, scrollSensitivity]);

  // Animation loop
  useFrame(() => {
    if (galleryGroupRef.current) {
      // Update camera position based on scroll
      const totalScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollFraction = currentScroll / totalScroll;
      const targetY = scrollFraction * height - height / 2;
      camera.position.y = -targetY;

      // Update rotation
      const currentRotationSpeed = autoRotate
        ? baseRotationSpeed + rotationSpeed * 0.01
        : rotationSpeed * 0.01;
      galleryGroupRef.current.rotation.y += currentRotationSpeed;

      // Decay rotation speed
      setRotationSpeed((prev) => prev * 0.95);
    }
  });

  return (
    <group ref={galleryGroupRef}>
      {/* Invisible cylinder for structure (optional) */}
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 30, 1, true]} />
        <meshPhongMaterial color={0xffffff} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Render all blocks */}
      {blocks.map((block, index) => (
        <primitive key={index} object={block} />
      ))}

      {/* Lighting */}
      <ambientLight intensity={1} />
    </group>
  );
}

export function AshfallGallery({
  className,
  images,
  numVerticalSections = 20,
  blocksPerSection = 5,
  verticalSpacing = 5,
  radius = 6,
  autoRotate = true,
  baseRotationSpeed = 0.0025,
  scrollSensitivity = 0.005,
  blockWidth = 2.5,
  blockHeight = 1.75,
}: AshfallGalleryProps) {
  const galleryImages = useMemo(() => {
    return images || generateRandomImages(50);
  }, [images]);

  const containerHeight = numVerticalSections * verticalSpacing * 100; // Scroll height

  return (
    <div className={cn('relative w-full', className)}>
      {/* Three.js Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{
            fov: 75,
            position: [0, 0, 12],
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          <GalleryMesh
            images={galleryImages}
            numVerticalSections={numVerticalSections}
            blocksPerSection={blocksPerSection}
            verticalSpacing={verticalSpacing}
            radius={radius}
            autoRotate={autoRotate}
            baseRotationSpeed={baseRotationSpeed}
            scrollSensitivity={scrollSensitivity}
            blockWidth={blockWidth}
            blockHeight={blockHeight}
          />
        </Canvas>
      </div>

      {/* Scrollable content to create scroll space */}
      <div className="relative z-10 pointer-events-none min-h-screen">
        <div className="h-screen flex items-center justify-center">
          <div className="text-white text-center bg-black/50 p-8 rounded-lg backdrop-blur-sm pointer-events-auto">
            <h1 className="text-4xl font-bold mb-4">Ashfall 3D Gallery</h1>
            <p className="text-lg text-gray-300 mb-6">
              Scroll to navigate through the cylindrical image gallery
            </p>
            <div className="text-sm text-gray-400">
              {numVerticalSections} sections • {blocksPerSection} blocks per section
            </div>
          </div>
        </div>

        {/* Create scrollable space proportional to sections */}
        {Array.from({ length: Math.floor(containerHeight / 1000) }).map((_, i) => (
          <div key={i} className="h-screen" />
        ))}
      </div>
    </div>
  );
}

export type { AshfallGalleryProps };
