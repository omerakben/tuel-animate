'use client';

import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// Extend for Three.js objects that React Three Fiber might not know about
extend({ PlaneGeometry: THREE.PlaneGeometry, VideoTexture: THREE.VideoTexture });

interface VideoGalleryConfig {
  rows?: number;
  columns?: number;
  curvature?: number;
  spacing?: number;
  imageWidth?: number;
  imageHeight?: number;
  depth?: number;
  elevation?: number;
  lookAtRange?: number;
  verticalCurvature?: number;
}

interface VideoPlane extends THREE.Mesh {
  userData: {
    basePosition: THREE.Vector3;
    baseRotation: THREE.Euler;
    parallaxFactor: number;
    randomOffset: THREE.Vector3;
    rotationModifier: THREE.Vector3;
    phaseOffset: number;
    video: HTMLVideoElement;
  };
}

interface HeaderProps {
  mouseX: number;
  mouseY: number;
  title?: string;
  nav?: string;
}

function Header({ mouseX, mouseY, title = 'Framecast', nav = 'Frames 2024' }: HeaderProps) {
  const headerRotationX = -mouseY * 30;
  const headerRotationY = mouseX * 30;
  const headerTranslateZ = Math.abs(mouseX * mouseY) * 50;

  const targetTransform = `
    translate(-50%, -50%)
    perspective(1000px)
    rotateX(${headerRotationX}deg)
    rotateY(${headerRotationY}deg)
    translateZ(${headerTranslateZ}px)
  `;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-center z-20">
        <p className="uppercase text-xs font-semibold px-1 bg-[#d4f70c] antialiased">{nav}</p>
      </nav>

      <div
        className="fixed top-1/2 left-1/2 text-center z-20"
        style={{ transform: targetTransform }}
      >
        <h1 className="uppercase text-[7.5vw] tracking-tight leading-none font-bold">{title}</h1>
      </div>
    </div>
  );
}

function VideoPlanes({
  config,
  mouseX,
  mouseY,
}: {
  config: Required<VideoGalleryConfig>;
  mouseX: number;
  mouseY: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [planes, setPlanes] = useState<VideoPlane[]>([]);

  // Sample video sources (you can replace with your actual video URLs)
  const videoSources = useMemo(
    () => [
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
    ],
    []
  );

  function createVideoElement(videoSource: string): HTMLVideoElement {
    const video = document.createElement('video');
    video.src = videoSource;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play().catch(() => {
      // Ignore autoplay errors
    });
    return video;
  }

  function calculateRotations(x: number, y: number) {
    const a = 1 / (config.depth * config.curvature);
    const slopeY = -2 * a * x;
    const rotationY = Math.atan(slopeY);

    const verticalFactor = config.verticalCurvature;
    const maxYDistance = (config.rows * config.spacing) / 2;
    const normalizedY = y / maxYDistance;
    const rotationX = normalizedY * verticalFactor;

    return { rotationX, rotationY };
  }

  function calculatePosition(row: number, col: number) {
    let x = (col - config.columns / 2) * config.spacing;
    let y = (row - config.rows / 2) * config.spacing;

    let z = (x * x) / (config.depth * config.curvature);

    const normalizedY = y / ((config.rows * config.spacing) / 2);
    z += Math.abs(normalizedY) * normalizedY * config.verticalCurvature * 5;

    y += config.elevation;

    const { rotationX, rotationY } = calculateRotations(x, y);

    return { x, y, z, rotationX, rotationY };
  }

  function createVideoPlane(row: number, col: number): VideoPlane {
    const videoSource = videoSources[Math.floor(Math.random() * videoSources.length)];

    const geometry = new THREE.PlaneGeometry(config.imageWidth, config.imageHeight);
    const video = createVideoElement(videoSource);
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(geometry, material) as unknown as VideoPlane;
    const { x, y, z, rotationX, rotationY } = calculatePosition(row, col);

    plane.position.set(x, y, z);
    plane.rotation.x = rotationX;
    plane.rotation.y = rotationY;

    plane.userData = {
      basePosition: new THREE.Vector3(x, y, z),
      baseRotation: new THREE.Euler(rotationX, rotationY, 0),
      parallaxFactor: Math.random() * 0.5 + 0.5,
      randomOffset: new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ),
      rotationModifier: new THREE.Vector3(
        Math.random() * 0.15 - 0.075,
        Math.random() * 0.15 - 0.075,
        Math.random() * 0.2 - 0.1
      ),
      phaseOffset: Math.random() * Math.PI * 2,
      video,
    };

    return plane;
  }

  // Initialize planes
  useEffect(() => {
    const newPlanes: VideoPlane[] = [];

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.columns; col++) {
        const plane = createVideoPlane(row, col);
        newPlanes.push(plane);
      }
    }

    // Clean up previous planes
    planes.forEach((plane) => {
      if (plane.userData.video) {
        plane.userData.video.pause();
        plane.userData.video.remove();
      }
    });

    setPlanes(newPlanes);

    // Cleanup on unmount
    return () => {
      newPlanes.forEach((plane) => {
        if (plane.userData.video) {
          plane.userData.video.pause();
          plane.userData.video.remove();
        }
      });
    };
  }, [config]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const mouseDistance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

    planes.forEach((plane) => {
      if (!plane.userData) return;

      const {
        basePosition,
        baseRotation,
        parallaxFactor,
        randomOffset,
        rotationModifier,
        phaseOffset,
      } = plane.userData;

      const parallaxX = mouseX * parallaxFactor * 3 * randomOffset.x;
      const parallaxY = mouseY * parallaxFactor * 3 * randomOffset.y;
      const oscillation = Math.sin(time + phaseOffset) * mouseDistance * 0.1;

      // Update position
      plane.position.x = basePosition.x + parallaxX + oscillation * randomOffset.x;
      plane.position.y = basePosition.y + parallaxY + oscillation * randomOffset.y;
      plane.position.z = basePosition.z + oscillation * randomOffset.z * parallaxFactor;

      // Update rotation
      plane.rotation.x =
        baseRotation.x +
        mouseY * rotationModifier.x * mouseDistance +
        oscillation * rotationModifier.x * 0.2;

      plane.rotation.y =
        baseRotation.y +
        mouseX * rotationModifier.y * mouseDistance +
        oscillation * rotationModifier.y * 0.2;

      plane.rotation.z =
        baseRotation.z +
        mouseX * mouseY * rotationModifier.z * 2 +
        oscillation * rotationModifier.z * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {planes.map((plane, index) => (
        <primitive key={index} object={plane} />
      ))}
    </group>
  );
}

function CameraController({
  mouseX,
  mouseY,
  config,
}: {
  mouseX: number;
  mouseY: number;
  config: Required<VideoGalleryConfig>;
}) {
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);

  useFrame((state) => {
    // Smooth camera movement
    setTargetX((prev) => prev + (mouseX - prev) * 0.05);
    setTargetY((prev) => prev + (mouseY - prev) * 0.05);

    const lookAtTarget = new THREE.Vector3(
      targetX * config.lookAtRange,
      -targetY * config.lookAtRange,
      (targetX * targetX * config.lookAtRange * config.lookAtRange) /
        (config.depth * config.curvature)
    );

    state.camera.lookAt(lookAtTarget);
  });

  return null;
}

export interface VideoGalleryProps {
  className?: string;
  config?: VideoGalleryConfig;
  title?: string;
  nav?: string;
}

export function VideoGallery({ className = '', config = {}, title, nav }: VideoGalleryProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const galleryConfig: Required<VideoGalleryConfig> = {
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
    ...config,
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const mouseY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePosition({ x: mouseX, y: mouseY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`w-full h-screen bg-white overflow-hidden ${className}`}>
      <Header mouseX={mousePosition.x} mouseY={mousePosition.y} title={title} nav={nav} />

      <Canvas
        camera={{
          position: [0, 0, 40],
          fov: 25,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true }}
        className="fixed inset-0"
      >
        <CameraController
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          config={galleryConfig}
        />
        <VideoPlanes config={galleryConfig} mouseX={mousePosition.x} mouseY={mousePosition.y} />
      </Canvas>
    </div>
  );
}
