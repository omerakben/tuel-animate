'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Extend VideoTexture for R3F
extend({ VideoTexture: THREE.VideoTexture });

// Video URLs - in production these would be proper video assets
const VIDEO_URLS = [
  '/videos/v1.mp4',
  '/videos/v2.mp4',
  '/videos/v3.mp4',
  '/videos/v4.mp4',
  '/videos/v5.mp4',
  '/videos/v6.mp4',
  '/videos/v7.mp4',
  '/videos/v8.mp4',
  '/videos/v9.mp4',
  '/videos/v10.mp4',
];

interface VideoGalleryParams {
  rows: number;
  columns: number;
  curvature: number;
  spacing: number;
  imageWidth: number;
  imageHeight: number;
  depth: number;
  elevation: number;
  lookAtRange: number;
  verticalCurvature: number;
}

const defaultParams: VideoGalleryParams = {
  rows: 7,
  columns: 7,
  curvature: 5,
  spacing: 10,
  imageWidth: 7,
  imageHeight: 4.5,
  depth: 7.5,
  elevation: 0,
  lookAtRange: 20,
  verticalCurvature: 0.5,
};

interface VideoPlaneData {
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  parallaxFactor: number;
  randomOffset: { x: number; y: number; z: number };
  rotationModifier: { x: number; y: number; z: number };
  phaseOffset: number;
  videoUrl: string;
}

interface VideoPlaneProps {
  data: VideoPlaneData;
  params: VideoGalleryParams;
  mouseX: number;
  mouseY: number;
}

function VideoPlane({ data, params, mouseX, mouseY }: VideoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const videoRef = useRef<HTMLVideoElement>(null!);

  // Create video element and texture
  const videoTexture = useMemo(() => {
    const video = document.createElement('video');
    video.src = data.videoUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    videoRef.current = video;

    // Start playing when ready
    video.addEventListener('loadeddata', () => {
      video.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Video autoplay prevented for', data.videoUrl);
      });
    });

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [data.videoUrl]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const mouseDistance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const parallaxX = mouseX * data.parallaxFactor * 3 * data.randomOffset.x;
    const parallaxY = mouseY * data.parallaxFactor * 3 * data.randomOffset.y;
    const oscillation = Math.sin(time + data.phaseOffset) * mouseDistance * 0.1;

    // Update position
    meshRef.current.position.x = data.x + parallaxX + oscillation * data.randomOffset.x;
    meshRef.current.position.y = data.y + parallaxY + oscillation * data.randomOffset.y;
    meshRef.current.position.z = data.z + oscillation * data.randomOffset.z * data.parallaxFactor;

    // Update rotation
    meshRef.current.rotation.x =
      data.rotationX +
      mouseY * data.rotationModifier.x * mouseDistance +
      oscillation * data.rotationModifier.x * 0.2;

    meshRef.current.rotation.y =
      data.rotationY +
      mouseX * data.rotationModifier.y * mouseDistance +
      oscillation * data.rotationModifier.y * 0.2;

    meshRef.current.rotation.z =
      mouseX * mouseY * data.rotationModifier.z * 2 + oscillation * data.rotationModifier.z * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[params.imageWidth, params.imageHeight]} />
      <meshBasicMaterial map={videoTexture} side={THREE.DoubleSide} />
    </mesh>
  );
}

interface VideoGallerySceneProps {
  params?: Partial<VideoGalleryParams>;
}

function VideoGalleryScene({ params: customParams }: VideoGallerySceneProps) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const lookAtTargetRef = useRef(new THREE.Vector3(0, 0, 0));

  const params = { ...defaultParams, ...customParams };

  // Calculate position and rotation for a grid item
  const calculatePosition = useCallback(
    (
      row: number,
      col: number
    ): Omit<
      VideoPlaneData,
      'parallaxFactor' | 'randomOffset' | 'rotationModifier' | 'phaseOffset' | 'videoUrl'
    > => {
      let x = (col - params.columns / 2) * params.spacing;
      let y = (row - params.rows / 2) * params.spacing;

      let z = (x * x) / (params.depth * params.curvature);

      const normalizedY = y / ((params.rows * params.spacing) / 2);
      z += Math.abs(normalizedY) * normalizedY * params.verticalCurvature * 5;

      y += params.elevation;

      // Calculate rotations
      const a = 1 / (params.depth * params.curvature);
      const slopeY = -2 * a * x;
      const rotationY = Math.atan(slopeY);

      const verticalFactor = params.verticalCurvature;
      const maxYDistance = (params.rows * params.spacing) / 2;
      const normalizedYRot = y / maxYDistance;
      const rotationX = normalizedYRot * verticalFactor;

      return { x, y, z, rotationX, rotationY };
    },
    [params]
  );

  // Generate video plane data
  const videoPlanes = useMemo(() => {
    const planes: VideoPlaneData[] = [];

    for (let row = 0; row < params.rows; row++) {
      for (let col = 0; col < params.columns; col++) {
        const position = calculatePosition(row, col);

        planes.push({
          ...position,
          parallaxFactor: Math.random() * 0.5 + 0.5,
          randomOffset: {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            z: Math.random() * 2 - 1,
          },
          rotationModifier: {
            x: Math.random() * 0.15 - 0.075,
            y: Math.random() * 0.15 - 0.075,
            z: Math.random() * 0.2 - 0.1,
          },
          phaseOffset: Math.random() * Math.PI * 2,
          videoUrl: VIDEO_URLS[Math.floor(Math.random() * VIDEO_URLS.length)],
        });
      }
    }

    return planes;
  }, [params, calculatePosition]);

  useFrame(() => {
    // Update mouse smoothing
    targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.05;
    targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.05;

    // Update camera target
    lookAtTargetRef.current.x = targetRef.current.x * params.lookAtRange;
    lookAtTargetRef.current.y = -targetRef.current.y * params.lookAtRange;
    lookAtTargetRef.current.z =
      (lookAtTargetRef.current.x * lookAtTargetRef.current.x) / (params.depth * params.curvature);

    camera.lookAt(lookAtTargetRef.current);
  });

  // Mouse move handler
  const handleMouseMove = useCallback((event: MouseEvent) => {
    mouseRef.current.x = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    mouseRef.current.y = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
  }, []);

  // Add mouse listener
  useMemo(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <>
      {videoPlanes.map((plane, index) => (
        <VideoPlane
          key={index}
          data={plane}
          params={params}
          mouseX={targetRef.current.x}
          mouseY={targetRef.current.y}
        />
      ))}
    </>
  );
}

interface ThreeJSVideoGalleryProps {
  className?: string;
  params?: Partial<VideoGalleryParams>;
  children?: React.ReactNode;
}

export function ThreeJSVideoGallery({
  className = '',
  params,
  children,
}: ThreeJSVideoGalleryProps) {
  return (
    <div className={`relative w-full h-screen overflow-hidden bg-white ${className}`}>
      <Canvas
        camera={{
          position: [0, 0, 40],
          fov: 25,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true }}
      >
        <VideoGalleryScene params={params} />
      </Canvas>

      {/* Header overlay */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
        <h1 className="text-[7.5vw] font-bold uppercase tracking-tight leading-none">Framecast</h1>
      </div>

      {/* Navigation overlay */}
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-center z-10">
        <p className="text-xs font-semibold uppercase px-1 py-1 bg-[#d4f70c] tracking-wide">
          Frames 2024
        </p>
      </nav>

      {children}
    </div>
  );
}

export default ThreeJSVideoGallery;
