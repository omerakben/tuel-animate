import { Canvas, useThree } from '@react-three/fiber';
import { cn } from '@tuel/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SlideData {
  id: number;
  title: string;
  image: string;
}

interface ThreeSliderSceneProps {
  slides: SlideData[];
  scrollProgress: number;
}

function ThreeSliderScene({ slides, scrollProgress }: ThreeSliderSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const { camera, gl } = useThree();

  // Create curved geometry
  const createCurvedGeometry = useCallback(() => {
    const parentWidth = 20;
    const parentHeight = 75;
    const curvature = 35;
    const segmentsX = 200;
    const segmentsY = 200;

    const geometry = new THREE.PlaneGeometry(parentWidth, parentHeight, segmentsX, segmentsY);

    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1];
      const distanceFromCenter = Math.abs(y / (parentHeight / 2));
      positions[i + 2] = Math.pow(distanceFromCenter, 2) * curvature;
    }
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  // Load images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const checkAllLoaded = () => {
      if (loadedCount === slides.length) {
        imagesRef.current = loadedImages;
        setImagesLoaded(true);
      }
    };

    slides.forEach((slide, index) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        loadedImages[index] = img;
        loadedCount++;
        checkAllLoaded();
      };

      img.onerror = () => {
        loadedCount++;
        checkAllLoaded();
      };

      img.src = slide.image;
    });
  }, [slides]);

  // Setup canvas texture
  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {
      alpha: false,
      willReadFrequently: false,
    });

    if (!ctx) return;

    canvas.width = 2048;
    canvas.height = 8192;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());

    canvasRef.current = canvas;
    ctxRef.current = ctx;
    textureRef.current = texture;

    return () => {
      texture.dispose();
    };
  }, [imagesLoaded, gl]);

  // Update texture based on scroll
  const updateTexture = useCallback(
    (offset = 0) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      const texture = textureRef.current;

      if (!canvas || !ctx || !texture || !imagesLoaded) return;

      const totalSlides = slides.length;
      const slideHeight = 15;
      const gap = 0.5;
      const cycleHeight = totalSlides * (slideHeight + gap);

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set up text style
      const fontSize = 180;
      ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const extraSlides = 2;

      for (let i = -extraSlides; i < totalSlides + extraSlides; i++) {
        let slideY = -i * (slideHeight + gap);
        slideY += offset * cycleHeight;

        const textureY = (slideY / cycleHeight) * canvas.height;
        let wrappedY = textureY % canvas.height;
        if (wrappedY < 0) wrappedY += canvas.height;

        let slideIndex = ((-i % totalSlides) + totalSlides) % totalSlides;
        const slide = slides[slideIndex];

        if (!slide) continue;

        const slideRect = {
          x: canvas.width * 0.05,
          y: wrappedY,
          width: canvas.width * 0.9,
          height: (slideHeight / cycleHeight) * canvas.height,
        };

        const img = imagesRef.current[slideIndex];
        if (img) {
          const imgAspect = img.width / img.height;
          const rectAspect = slideRect.width / slideRect.height;

          let drawWidth, drawHeight, drawX, drawY;

          if (imgAspect > rectAspect) {
            drawHeight = slideRect.height;
            drawWidth = drawHeight * imgAspect;
            drawX = slideRect.x + (slideRect.width - drawWidth) / 2;
            drawY = slideRect.y;
          } else {
            drawWidth = slideRect.width;
            drawHeight = drawWidth / imgAspect;
            drawX = slideRect.x;
            drawY = slideRect.y + (slideRect.height - drawHeight) / 2;
          }

          ctx.save();
          ctx.beginPath();

          // Use simpler rectangle instead of roundRect for compatibility
          ctx.rect(slideRect.x, slideRect.y, slideRect.width, slideRect.height);
          ctx.clip();
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();

          // Draw title
          ctx.fillStyle = 'white';
          ctx.fillText(slide.title, canvas.width / 2, wrappedY + slideRect.height / 2);
        }
      }

      texture.needsUpdate = true;
    },
    [slides, imagesLoaded]
  );

  // Update on scroll progress change
  useEffect(() => {
    updateTexture(-scrollProgress);
  }, [scrollProgress, updateTexture]);

  // Setup camera position
  useEffect(() => {
    const distance = 17.5;
    const heightOffset = 5;
    const offsetX = distance * Math.sin(THREE.MathUtils.degToRad(20));
    const offsetZ = distance * Math.cos(THREE.MathUtils.degToRad(20));

    camera.position.set(offsetX, heightOffset, offsetZ);
    camera.lookAt(0, -2, 0);
    camera.rotation.z = THREE.MathUtils.degToRad(-5);
  }, [camera]);

  return (
    <mesh
      ref={meshRef}
      geometry={createCurvedGeometry()}
      position={[0, 0, 0]}
      rotation={[THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(20), 0]}
    >
      <meshBasicMaterial map={textureRef.current} side={THREE.DoubleSide} />
    </mesh>
  );
}

export interface ThreeSliderProps {
  className?: string;
  slides?: SlideData[];
  backgroundColor?: string;
}

const defaultSlides: SlideData[] = [
  { id: 1, title: 'Field Unit', image: '/images/slide1.jpg' },
  { id: 2, title: 'Astral Convergence', image: '/images/slide2.jpg' },
  { id: 3, title: 'Eclipse Core', image: '/images/slide3.jpg' },
  { id: 4, title: 'Luminous', image: '/images/slide4.jpg' },
  { id: 5, title: 'Serenity', image: '/images/slide5.jpg' },
  { id: 6, title: 'Nebula Point', image: '/images/slide6.jpg' },
  { id: 7, title: 'Horizon', image: '/images/slide7.jpg' },
];

export function ThreeSlider({
  className,
  slides = defaultSlides,
  backgroundColor = '#000000',
}: ThreeSliderProps) {
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
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: backgroundColor }}
      >
        <ThreeSliderScene slides={slides} scrollProgress={scrollProgress} />
      </Canvas>

      {/* Navigation overlay */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 text-white">
        <div className="flex items-center gap-4">
          <p className="text-xl font-bold">Codegrid</p>
          <p className="text-sm opacity-70">3D Slider</p>
        </div>
        <div className="flex gap-6">
          <p className="hover:opacity-70 transition-opacity cursor-pointer">Index</p>
          <p className="hover:opacity-70 transition-opacity cursor-pointer">About</p>
        </div>
      </nav>

      <footer className="absolute bottom-0 left-0 right-0 z-10 flex justify-between items-center p-6 text-white text-sm">
        <p>3D Slider Experiment</p>
        <p>&copy; 2025</p>
      </footer>

      {/* Scroll content to enable scrolling */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-[400vh]" />
      </div>
    </div>
  );
}
