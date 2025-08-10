import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGsapContext } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';

export interface ImageTrailProps {
  images: string[];
  className?: string;
  imageSize?: { width: number; height: number };
  maxImages?: number;
  threshold?: number;
  fadeOutDuration?: number;
  animationDuration?: number;
  stagger?: number;
  easing?: string;
  opacity?: number;
  scale?: number;
  rotation?: number;
  blur?: number;
  enabled?: boolean;
  zIndex?: number;
}

interface TrailImage {
  element: HTMLDivElement;
  removeTime: number;
  timeline?: gsap.core.Timeline;
}

export function ImageTrail({
  images,
  className,
  imageSize = { width: 175, height: 175 },
  maxImages = 20,
  threshold = 150,
  fadeOutDuration = 1000,
  animationDuration = 750,
  stagger = 100,
  easing = 'power4.out',
  opacity = 0.9,
  scale = 1,
  rotation = 0,
  blur = 0,
  enabled = true,
  zIndex = 10,
}: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<TrailImage[]>([]);
  const currentImageIndexRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGsapContext((ctx) => {
    if (!isClient || !enabled || !isDesktop || images.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    const distance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.hypot(x2 - x1, y2 - y1);

    const createTrailImage = () => {
      if (trailRef.current.length >= maxImages) return;

      const imgContainer = document.createElement('div');
      imgContainer.className = 'trail-image absolute pointer-events-none';
      imgContainer.style.cssText = `
        width: ${imageSize.width}px;
        height: ${imageSize.height}px;
        left: ${mousePosRef.current.x - imageSize.width / 2}px;
        top: ${mousePosRef.current.y - imageSize.height / 2}px;
        z-index: ${zIndex};
      `;

      const img = document.createElement('img');
      img.src = images[currentImageIndexRef.current];
      img.className = 'w-full h-full object-cover rounded-lg';
      img.style.filter = blur > 0 ? `blur(${blur}px)` : '';
      imgContainer.appendChild(img);

      container.appendChild(imgContainer);
      currentImageIndexRef.current = (currentImageIndexRef.current + 1) % images.length;

      // Create reveal animation
      const tl = gsap.timeline({
        onComplete: () => {
          // Start fade out after animation completes
          gsap.to(imgContainer, {
            opacity: 0,
            scale: scale * 0.8,
            duration: fadeOutDuration / 1000,
            ease: 'power2.in',
            onComplete: () => {
              if (imgContainer.parentNode) {
                imgContainer.parentNode.removeChild(imgContainer);
              }
              // Remove from trail array
              const index = trailRef.current.findIndex((item) => item.element === imgContainer);
              if (index > -1) {
                trailRef.current.splice(index, 1);
              }
            },
          });
        },
      });

      // Complex reveal animation with multiple layers
      const layers = 10;
      const maskLayers: HTMLDivElement[] = [];

      for (let i = 0; i < layers; i++) {
        const layer = document.createElement('div');
        layer.className = 'absolute inset-0 overflow-hidden';
        const startY = (i * 100) / layers;
        const endY = ((i + 1) * 100) / layers;
        layer.style.clipPath = `polygon(50% ${startY}%, 50% ${startY}%, 50% ${endY}%, 50% ${endY}%)`;
        
        const layerImg = img.cloneNode(true) as HTMLImageElement;
        layer.appendChild(layerImg);
        imgContainer.appendChild(layer);
        maskLayers.push(layer);
      }

      // Hide original image
      img.style.display = 'none';

      // Animate layers
      tl.to(maskLayers, {
        clipPath: (i) => {
          const startY = (i * 100) / layers;
          const endY = ((i + 1) * 100) / layers;
          return `polygon(0% ${startY}%, 100% ${startY}%, 100% ${endY}%, 0% ${endY}%)`;
        },
        duration: animationDuration / 1000,
        stagger: stagger / 1000,
        ease: easing,
      })
        .to(
          imgContainer,
          {
            opacity,
            scale,
            rotation,
            duration: animationDuration / 1000,
            ease: easing,
          },
          0
        );

      trailRef.current.push({
        element: imgContainer,
        removeTime: Date.now() + animationDuration + fadeOutDuration,
        timeline: tl,
      });
    };

    const updateMousePosition = () => {
      const dist = distance(
        mousePosRef.current.x,
        mousePosRef.current.y,
        lastMousePosRef.current.x,
        lastMousePosRef.current.y
      );

      if (dist > threshold) {
        createTrailImage();
        lastMousePosRef.current = { ...mousePosRef.current };
      }

      rafRef.current = requestAnimationFrame(updateMousePosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // Start animation loop
    container.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(updateMousePosition);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      // Clean up trail images
      trailRef.current.forEach((item) => {
        if (item.timeline) {
          item.timeline.kill();
        }
        if (item.element.parentNode) {
          item.element.parentNode.removeChild(item.element);
        }
      });
      trailRef.current = [];
    };
  }, [
    enabled,
    isDesktop,
    images,
    imageSize,
    maxImages,
    threshold,
    fadeOutDuration,
    animationDuration,
    stagger,
    easing,
    opacity,
    scale,
    rotation,
    blur,
    zIndex,
  ]);

  if (!enabled || !isDesktop) return null;

  return (
    <div
      ref={containerRef}
      className={cn('fixed inset-0 pointer-events-none overflow-hidden', className)}
      style={{ zIndex }}
    />
  );
}