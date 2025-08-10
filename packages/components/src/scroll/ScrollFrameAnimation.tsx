import { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext, useIsomorphicLayoutEffect } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';

if (isClient) {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollFrameAnimationProps {
  frameCount: number;
  framePath: (index: number) => string;
  className?: string;
  scrollSpeed?: number;
  pinContainer?: boolean;
  startTrigger?: string;
  endTrigger?: string;
  onProgress?: (progress: number) => void;
  children?: ReactNode;
  fallback?: ReactNode;
  preloadFrames?: boolean;
}

export function ScrollFrameAnimation({
  frameCount,
  framePath,
  className,
  scrollSpeed = 1,
  pinContainer = true,
  startTrigger = 'top top',
  endTrigger = 'bottom top',
  onProgress,
  children,
  fallback,
  preloadFrames = true,
}: ScrollFrameAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ current: 0 });
  const isLoadedRef = useRef(false);

  // Set up canvas
  useIsomorphicLayoutEffect(() => {
    if (!canvasRef.current || !isClient) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    contextRef.current = context;

    const setCanvasSize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      context.scale(pixelRatio, pixelRatio);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  // Preload images
  useEffect(() => {
    if (!preloadFrames || !isClient) return;

    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === frameCount) {
        isLoadedRef.current = true;
        renderFrame(0);
      }
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.onload = onImageLoad;
      img.onerror = onImageLoad; // Continue even if some frames fail
      img.src = framePath(i);
      images.push(img);
    }

    imagesRef.current = images;
  }, [frameCount, framePath, preloadFrames]);

  // Render frame
  const renderFrame = (frameIndex: number) => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    
    if (!context || !canvas || images.length === 0) return;

    const img = images[Math.floor(frameIndex)];
    if (!img || !img.complete) return;

    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Cover fit the image
    const imageAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (imageAspect > canvasAspect) {
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imageAspect;
      drawX = (canvasWidth - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imageAspect;
      drawX = 0;
      drawY = (canvasHeight - drawHeight) / 2;
    }

    context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  };

  // Set up scroll animation
  useGsapContext(() => {
    if (!isLoadedRef.current || !isClient) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: startTrigger,
        end: endTrigger,
        scrub: scrollSpeed,
        pin: pinContainer,
        onUpdate: (self) => {
          const frame = Math.floor(self.progress * (frameCount - 1));
          frameRef.current.current = frame;
          renderFrame(frame);
          onProgress?.(self.progress);
        },
      },
    });

    return () => {
      tl.kill();
    };
  }, [frameCount, scrollSpeed, pinContainer, startTrigger, endTrigger, onProgress]);

  if (!isClient) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        style={{ zIndex: -1 }}
      />
      {children}
    </div>
  );
}