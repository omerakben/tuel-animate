import { cn, isClient } from '@tuel/utils';
import { useEffect, useRef, useState } from 'react';

export interface HoverDistortionProps {
  image: string;
  displacementImage?: string;
  className?: string;
  intensity?: number;
  speed?: number;
  scale?: number;
  hover?: boolean;
  autoPlay?: boolean;
  rgbShift?: boolean;
  rgbIntensity?: number;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';
  onHover?: () => void;
  onLeave?: () => void;
}

export function HoverDistortion({
  image,
  displacementImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  className,
  intensity = 0.3,
  speed = 0.5,
  scale = 1.1,
  hover = true,
  autoPlay = false,
  rgbShift = false,
  rgbIntensity = 0.1,
  blendMode = 'normal',
  onHover,
  onLeave,
}: HoverDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load images
    const img = new Image();
    const displacementImg = new Image();
    let imageLoaded = false;
    let displacementLoaded = false;

    img.onload = () => {
      imageLoaded = true;
      if (displacementLoaded) startAnimation();
    };

    displacementImg.onload = () => {
      displacementLoaded = true;
      if (imageLoaded) startAnimation();
    };

    img.src = image;
    displacementImg.src = displacementImage;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();

    // Animation function
    const startAnimation = () => {
      const animate = () => {
        if (!ctx || !canvas) return;

        // Update progress
        const target = isHovered || autoPlay ? 1 : 0;
        progressRef.current += (target - progressRef.current) * speed * 0.1;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context
        ctx.save();

        // Apply scale transform
        const currentScale = 1 + (scale - 1) * progressRef.current;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(currentScale, currentScale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Apply blend mode
        ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;

        // Draw base image
        const aspectRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (aspectRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = drawHeight * aspectRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = canvas.width;
          drawHeight = drawWidth / aspectRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }

        // Apply distortion effect
        if (progressRef.current > 0.01) {
          // Create temporary canvas for displacement
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');

          if (tempCtx) {
            // Draw displacement map
            tempCtx.drawImage(displacementImg, 0, 0, canvas.width, canvas.height);
            const displacementData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);

            // Draw distorted image
            const segmentsX = 20;
            const segmentsY = 20;
            const segmentWidth = canvas.width / segmentsX;
            const segmentHeight = canvas.height / segmentsY;

            for (let y = 0; y < segmentsY; y++) {
              for (let x = 0; x < segmentsX; x++) {
                const idx = (y * segmentHeight * canvas.width + x * segmentWidth) * 4;
                const dispX =
                  (displacementData.data[idx] / 255 - 0.5) * intensity * progressRef.current * 50;
                const dispY =
                  (displacementData.data[idx + 1] / 255 - 0.5) *
                  intensity *
                  progressRef.current *
                  50;

                ctx.drawImage(
                  img,
                  ((x * segmentWidth) / canvas.width) * img.width,
                  ((y * segmentHeight) / canvas.height) * img.height,
                  (segmentWidth / canvas.width) * img.width,
                  (segmentHeight / canvas.height) * img.height,
                  offsetX + x * segmentWidth + dispX,
                  offsetY + y * segmentHeight + dispY,
                  segmentWidth,
                  segmentHeight
                );
              }
            }
          }
        } else {
          // Draw normal image
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }

        // Apply RGB shift effect
        if (rgbShift && progressRef.current > 0.01) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const shift = Math.floor(rgbIntensity * progressRef.current * 10);

          for (let i = 0; i < data.length; i += 4) {
            // Shift red channel
            if (i + shift * 4 < data.length) {
              data[i] = data[i + shift * 4];
            }
            // Shift blue channel
            if (i - shift * 4 >= 0) {
              data[i + 2] = data[i - shift * 4 + 2];
            }
          }

          ctx.putImageData(imageData, 0, 0);
        }

        // Restore context
        ctx.restore();

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    // Event handlers
    const handleMouseEnter = () => {
      if (!hover) return;
      setIsHovered(true);
      onHover?.();
    };

    const handleMouseLeave = () => {
      if (!hover) return;
      setIsHovered(false);
      onLeave?.();
    };

    if (hover) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [
    image,
    displacementImage,
    intensity,
    speed,
    scale,
    hover,
    autoPlay,
    rgbShift,
    rgbIntensity,
    blendMode,
    isHovered,
  ]);

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ mixBlendMode: blendMode }} />
    </div>
  );
}
