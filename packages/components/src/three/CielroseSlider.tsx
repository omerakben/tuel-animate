'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

interface Slide {
  title: string;
  url: string;
  image: string;
}

export interface CielroseSliderProps {
  slides: Slide[];
  autoRotate?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

// Shader definitions
const vertexShader = `
  uniform float uScrollIntensity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float sideDistortion = sin(uv.y * 3.14159) * uScrollIntensity * 0.5;
    float topBottomDistortion = sin(uv.x * 3.14159) * uScrollIntensity * 0.2;
    pos.z += sideDistortion + topBottomDistortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uCurrentTexture;
  uniform sampler2D uNextTexture;
  uniform float uScrollPosition;
  varying vec2 vUv;

  void main() {
    float normalizedPosition = fract(uScrollPosition);

    vec2 currentUv = vec2(vUv.x, mod(vUv.y - normalizedPosition, 1.0));
    vec2 nextUv = vec2(vUv.x, mod(vUv.y + 1.0 - normalizedPosition, 1.0));

    if (vUv.y < normalizedPosition) {
      gl_FragColor = texture2D(uNextTexture, nextUv);
    } else {
      gl_FragColor = texture2D(uCurrentTexture, currentUv);
    }
  }
`;

interface SliderMeshProps {
  slides: Slide[];
  autoRotate: boolean;
}

function SliderMesh({ slides, autoRotate }: SliderMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollPosition = useRef(0);
  const scrollIntensity = useRef(0);
  const targetScrollIntensity = useRef(0); // Load textures
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return slides.map((slide) => {
      const texture = loader.load(slide.image);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    });
  }, [slides]);

  // Shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uCurrentTexture: { value: textures[0] || null },
        uNextTexture: { value: textures[1] || null },
        uScrollPosition: { value: 0 },
        uScrollIntensity: { value: 0 },
      },
    });
  }, [textures]);

  // Handle wheel events for manual navigation
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isTransitioning) return;

      const delta = event.deltaY > 0 ? 1 : -1;
      const newIndex = (currentIndex + delta + slides.length) % slides.length;

      if (newIndex !== currentIndex) {
        transitionToSlide(newIndex);
      }

      // Add scroll intensity for distortion effect
      targetScrollIntensity.current = Math.abs(event.deltaY) * 0.01;
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentIndex, isTransitioning, slides.length]);

  // Auto rotation
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      if (!isTransitioning) {
        const newIndex = (currentIndex + 1) % slides.length;
        transitionToSlide(newIndex);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [autoRotate, currentIndex, isTransitioning, slides.length]);

  // Transition function
  const transitionToSlide = (newIndex: number) => {
    if (isTransitioning || !materialRef.current) return;

    setIsTransitioning(true);

    // Update textures
    materialRef.current.uniforms.uCurrentTexture.value = textures[currentIndex];
    materialRef.current.uniforms.uNextTexture.value = textures[newIndex];

    // Animate scroll position
    gsap.to(scrollPosition, {
      current: scrollPosition.current + 1,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (materialRef.current) {
          materialRef.current.uniforms.uScrollPosition.value = scrollPosition.current;
        }
      },
      onComplete: () => {
        setCurrentIndex(newIndex);
        setIsTransitioning(false);
        scrollPosition.current = 0;
        if (materialRef.current) {
          materialRef.current.uniforms.uScrollPosition.value = 0;
        }
      },
    });
  };

  // Animation loop
  useFrame(() => {
    if (materialRef.current) {
      // Smooth scroll intensity animation
      scrollIntensity.current = THREE.MathUtils.lerp(
        scrollIntensity.current,
        targetScrollIntensity.current,
        0.1
      );

      // Decay scroll intensity
      targetScrollIntensity.current *= 0.95;

      materialRef.current.uniforms.uScrollIntensity.value = scrollIntensity.current;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 3, 32, 32]} />
      <shaderMaterial ref={materialRef} {...shaderMaterial} transparent />
    </mesh>
  );
}

interface SliderTitleProps {
  slides: Slide[];
  currentIndex: number;
}

function SliderTitle({ slides, currentIndex }: SliderTitleProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    if (prevIndex.current !== currentIndex && titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }
      );
    }
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  return (
    <div className="absolute bottom-8 left-8 z-10">
      <div ref={titleRef} className="text-white text-4xl font-bold tracking-wide">
        {slides[currentIndex]?.title}
      </div>
      <div className="text-white/60 text-sm mt-2">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
}

export function CielroseSlider({
  slides,
  autoRotate = false,
  className = '',
}: CielroseSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!slides || slides.length === 0) {
    return (
      <div
        className={`bg-gray-900 flex items-center justify-center text-white w-full h-full ${className}`}
      >
        No slides provided
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-black w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <SliderMesh slides={slides} autoRotate={autoRotate} />
      </Canvas>

      <SliderTitle slides={slides} currentIndex={currentIndex} />

      {/* Navigation dots */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border border-white/40 transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-transparent hover:bg-white/20'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute top-8 right-8 text-white/60 text-sm">Scroll to navigate</div>
    </div>
  );
}

export type { Slide };
