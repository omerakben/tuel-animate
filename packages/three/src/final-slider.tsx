'use client';

import { useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface SliderSettings {
  wheelSensitivity: number;
  touchSensitivity: number;
  momentumMultiplier: number;
  smoothing: number;
  slideLerp: number;
  distortionDecay: number;
  maxDistortion: number;
  distortionSensitivity: number;
  distortionSmoothing: number;
}

const defaultSettings: SliderSettings = {
  wheelSensitivity: 0.01,
  touchSensitivity: 0.01,
  momentumMultiplier: 2,
  smoothing: 0.1,
  slideLerp: 0.075,
  distortionDecay: 0.95,
  maxDistortion: 2.5,
  distortionSensitivity: 0.15,
  distortionSmoothing: 0.075,
};

interface SlideData {
  originalVertices: Float32Array;
  index: number;
  targetX: number;
  currentX: number;
}

interface SlideProps {
  index: number;
  slideWidth: number;
  slideHeight: number;
  gap: number;
  imageUrls: string[];
  colors: string[];
  position: THREE.Vector3;
  slideData: React.MutableRefObject<SlideData[]>;
}

function Slide({
  index,
  slideWidth,
  slideHeight,
  imageUrls,
  colors,
  position,
  slideData,
}: SlideProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometryRef = useRef<THREE.PlaneGeometry>(null!);

  // Try to load texture, fallback to color if failed
  const textures = useTexture(imageUrls, (textures) => {
    // Success callback - textures loaded
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });
  });

  // Create geometry and store slide data
  useMemo(() => {
    const geom = new THREE.PlaneGeometry(slideWidth, slideHeight, 32, 16);
    const originalVertices = new Float32Array([...geom.attributes.position.array]);

    // Store slide data
    slideData.current[index] = {
      originalVertices,
      index,
      targetX: position.x,
      currentX: position.x,
    };

    return geom;
  }, [slideWidth, slideHeight, index, position.x, slideData]);

  const material = useMemo(() => {
    const imageIndex = index % imageUrls.length;
    const texture = textures[imageIndex];
    const color = colors[index % colors.length];

    if (texture) {
      return new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
    } else {
      return new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        side: THREE.DoubleSide,
      });
    }
  }, [textures, colors, index, imageUrls.length]);

  useEffect(() => {
    if (meshRef.current && textures[index % imageUrls.length]) {
      const texture = textures[index % imageUrls.length];
      if (texture?.image) {
        const imgAspect = texture.image.width / texture.image.height;
        const slideAspect = slideWidth / slideHeight;

        if (imgAspect > slideAspect) {
          meshRef.current.scale.y = slideAspect / imgAspect;
        } else {
          meshRef.current.scale.x = imgAspect / slideAspect;
        }
      }
    }

    // Store mesh reference for animation updates
    if (meshRef.current) {
      meshRef.current.userData.index = index;
    }
  }, [textures, index, imageUrls.length, slideWidth, slideHeight]);

  return (
    <mesh ref={meshRef} position={position} material={material}>
      <planeGeometry ref={geometryRef} args={[slideWidth, slideHeight, 32, 16]} />
    </mesh>
  );
}

interface FinalSliderSceneProps {
  slideCount?: number;
  imageUrls?: string[];
  colors?: string[];
  settings?: Partial<SliderSettings>;
}

function FinalSliderScene({
  slideCount = 10,
  imageUrls = ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg', '/img5.jpg'],
  colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'],
  settings: customSettings = {},
}: FinalSliderSceneProps) {
  const settings = { ...defaultSettings, ...customSettings };
  const slideWidth = 3.0;
  const slideHeight = 1.5;
  const gap = 0.1;
  const slideUnit = slideWidth + gap;
  const totalWidth = slideCount * slideUnit;

  // Slider state
  const stateRef = useRef({
    currentPosition: 0,
    targetPosition: 0,
    isScrolling: false,
    autoScrollSpeed: 0,
    lastTime: 0,
    touchStartX: 0,
    touchLastX: 0,
    currentDistortionFactor: 0,
    targetDistortionFactor: 0,
    peakVelocity: 0,
    velocityHistory: [0, 0, 0, 0, 0],
  });

  const slideDataRef = useRef<SlideData[]>([]);
  const meshesRef = useRef<THREE.Mesh[]>([]);

  // Create slides
  const slides = useMemo(() => {
    return Array.from({ length: slideCount }, (_, i) => {
      const x = i * slideUnit - totalWidth / 2;
      return {
        index: i,
        position: new THREE.Vector3(x, 0, 0),
      };
    });
  }, [slideCount, slideUnit, totalWidth]);

  // Update curve distortion function
  const updateCurve = useCallback(
    (mesh: THREE.Mesh, worldPositionX: number, distortionFactor: number) => {
      const geometry = mesh.geometry as THREE.PlaneGeometry;
      const positionAttribute = geometry.attributes.position;
      const slideData = slideDataRef.current.find((s) => s.index === mesh.userData.index);

      if (!slideData) return;

      const distortionCenter = new THREE.Vector2(0, 0);
      const distortionRadius = 2.0;
      const maxCurvature = settings.maxDistortion * distortionFactor;

      for (let i = 0; i < positionAttribute.count; i++) {
        const x = slideData.originalVertices[i * 3];
        const y = slideData.originalVertices[i * 3 + 1];

        const vertexWorldPosX = worldPositionX + x;
        const distFromCenter = Math.sqrt(
          Math.pow(vertexWorldPosX - distortionCenter.x, 2) + Math.pow(y - distortionCenter.y, 2)
        );

        const distortionStrength = Math.max(0, 1 - distFromCenter / distortionRadius);
        const curveZ = Math.pow(Math.sin((distortionStrength * Math.PI) / 2), 1.5) * maxCurvature;

        positionAttribute.setZ(i, curveZ);
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    },
    [settings.maxDistortion]
  );

  // Event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = stateRef.current;
      if (e.key === 'ArrowLeft') {
        state.targetPosition += slideUnit;
        state.targetDistortionFactor = Math.min(1.0, state.targetDistortionFactor + 0.3);
      } else if (e.key === 'ArrowRight') {
        state.targetPosition -= slideUnit;
        state.targetDistortionFactor = Math.min(1.0, state.targetDistortionFactor + 0.3);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const state = stateRef.current;
      const wheelStrength = Math.abs(e.deltaY) * 0.001;
      state.targetDistortionFactor = Math.min(1.0, state.targetDistortionFactor + wheelStrength);

      state.targetPosition -= e.deltaY * settings.wheelSensitivity;
      state.isScrolling = true;
      state.autoScrollSpeed = Math.min(Math.abs(e.deltaY) * 0.0005, 0.05) * Math.sign(e.deltaY);

      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(() => {
        state.isScrolling = false;
      }, 150);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const state = stateRef.current;
      state.touchStartX = e.touches[0].clientX;
      state.touchLastX = state.touchStartX;
      state.isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const state = stateRef.current;
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - state.touchLastX;
      state.touchLastX = touchX;

      const touchStrength = Math.abs(deltaX) * 0.02;
      state.targetDistortionFactor = Math.min(1.0, state.targetDistortionFactor + touchStrength);

      state.targetPosition -= deltaX * settings.touchSensitivity;
      state.isScrolling = true;
    };

    const handleTouchEnd = () => {
      const state = stateRef.current;
      const velocity = (state.touchLastX - state.touchStartX) * 0.005;
      if (Math.abs(velocity) > 0.5) {
        state.autoScrollSpeed = -velocity * settings.momentumMultiplier * 0.05;
        state.targetDistortionFactor = Math.min(
          1.0,
          Math.abs(velocity) * 3 * settings.distortionSensitivity
        );
        state.isScrolling = true;
        setTimeout(() => {
          state.isScrolling = false;
        }, 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [settings, slideUnit]);

  useFrame((state) => {
    const time = state.clock.elapsedTime * 1000;
    const sliderState = stateRef.current;
    const deltaTime = sliderState.lastTime ? (time - sliderState.lastTime) / 1000 : 0.016;
    sliderState.lastTime = time;

    const prevPos = sliderState.currentPosition;

    if (sliderState.isScrolling) {
      sliderState.targetPosition += sliderState.autoScrollSpeed;
      const speedBasedDecay = 0.97 - Math.abs(sliderState.autoScrollSpeed) * 0.5;
      sliderState.autoScrollSpeed *= Math.max(0.92, speedBasedDecay);

      if (Math.abs(sliderState.autoScrollSpeed) < 0.001) {
        sliderState.autoScrollSpeed = 0;
      }
    }

    sliderState.currentPosition +=
      (sliderState.targetPosition - sliderState.currentPosition) * settings.smoothing;

    const currentVelocity = Math.abs(sliderState.currentPosition - prevPos) / deltaTime;
    sliderState.velocityHistory.push(currentVelocity);
    sliderState.velocityHistory.shift();

    const avgVelocity =
      sliderState.velocityHistory.reduce((sum, val) => sum + val, 0) /
      sliderState.velocityHistory.length;

    if (avgVelocity > sliderState.peakVelocity) {
      sliderState.peakVelocity = avgVelocity;
    }

    const velocityRatio = avgVelocity / (sliderState.peakVelocity + 0.001);
    const isDecelerating = velocityRatio < 0.7 && sliderState.peakVelocity > 0.5;

    sliderState.peakVelocity *= 0.99;

    const movementDistortion = Math.min(1.0, currentVelocity * 0.1);
    if (currentVelocity > 0.05) {
      sliderState.targetDistortionFactor = Math.max(
        sliderState.targetDistortionFactor,
        movementDistortion
      );
    }

    if (isDecelerating || avgVelocity < 0.2) {
      const decayRate = isDecelerating ? settings.distortionDecay : settings.distortionDecay * 0.9;
      sliderState.targetDistortionFactor *= decayRate;
    }

    sliderState.currentDistortionFactor +=
      (sliderState.targetDistortionFactor - sliderState.currentDistortionFactor) *
      settings.distortionSmoothing;

    // Update slide positions and distortions
    meshesRef.current.forEach((mesh, i) => {
      if (!mesh) return;

      let baseX = i * slideUnit - sliderState.currentPosition;
      baseX = ((baseX % totalWidth) + totalWidth) % totalWidth;

      if (baseX > totalWidth / 2) {
        baseX -= totalWidth;
      }

      const slideData = slideDataRef.current[i];
      if (slideData) {
        const isWrapping = Math.abs(baseX - slideData.targetX) > slideWidth * 2;
        if (isWrapping) {
          slideData.currentX = baseX;
        }

        slideData.targetX = baseX;
        slideData.currentX += (slideData.targetX - slideData.currentX) * settings.slideLerp;

        const wrapThreshold = totalWidth / 2 + slideWidth;
        if (Math.abs(slideData.currentX) < wrapThreshold * 1.5) {
          mesh.position.x = slideData.currentX;
          updateCurve(mesh, mesh.position.x, sliderState.currentDistortionFactor);
        }
      }
    });
  });

  // Store mesh references as they're created
  const handleMeshRef = useCallback((mesh: THREE.Mesh | null, index: number) => {
    if (mesh) {
      meshesRef.current[index] = mesh;
      mesh.userData.index = index;
    }
  }, []);

  return (
    <>
      {slides.map((slide, index) => (
        <group
          key={index}
          ref={(group) => {
            if (group && group.children[0]) {
              handleMeshRef(group.children[0] as THREE.Mesh, index);
            }
          }}
        >
          <Slide
            index={index}
            slideWidth={slideWidth}
            slideHeight={slideHeight}
            gap={gap}
            imageUrls={imageUrls}
            colors={colors}
            position={slide.position}
            slideData={slideDataRef}
          />
        </group>
      ))}
    </>
  );
}

interface ThreeJSFinalSliderProps {
  className?: string;
  slideCount?: number;
  imageUrls?: string[];
  colors?: string[];
  settings?: Partial<SliderSettings>;
  children?: React.ReactNode;
}

export function ThreeJSFinalSlider({
  className = '',
  slideCount = 10,
  imageUrls = ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg', '/img5.jpg'],
  colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'],
  settings = {},
  children,
}: ThreeJSFinalSliderProps) {
  return (
    <div className={`relative w-full h-screen overflow-hidden bg-[#e3e3db] ${className}`}>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#e3e3db']} />
        <FinalSliderScene
          slideCount={slideCount}
          imageUrls={imageUrls}
          colors={colors}
          settings={settings}
        />
      </Canvas>

      {/* Navigation overlay */}
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-10 text-[#0f0f0f]">
        <p className="text-xs font-semibold uppercase tracking-tight">[ Silhouette ]</p>
        <p className="text-xs font-semibold uppercase tracking-tight">/ Experiment by Codegrid</p>
      </nav>

      {/* Footer overlay */}
      <footer className="fixed bottom-0 left-0 w-full p-8 flex justify-between items-center z-10 text-[#0f0f0f]">
        <p className="text-xs font-semibold uppercase tracking-tight">
          Unlock Source Code with PRO
        </p>
        <p className="text-xs font-semibold uppercase tracking-tight">Link in description ↓</p>
      </footer>

      {children}
    </div>
  );
}

export default ThreeJSFinalSlider;
