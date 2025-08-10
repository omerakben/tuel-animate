import { cn, isClient } from '@tuel/utils';
import { useEffect, useRef, useState } from 'react';

export interface ParticleTextProps {
  text: string;
  className?: string;
  font?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  particleSize?: number;
  particleGap?: number;
  mouseRadius?: number;
  mouseForce?: number;
  returnSpeed?: number;
  friction?: number;
  ease?: number;
  hover?: boolean;
  explode?: boolean;
  wave?: boolean;
  waveSpeed?: number;
  waveAmplitude?: number;
  interactive?: boolean;
  density?: number;
}

interface TextParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  distance: number;
}

export function ParticleText({
  text,
  className,
  font = 'bold 80px Arial',
  fontSize = 80,
  color = '#ffffff',
  backgroundColor = 'transparent',
  particleSize = 2,
  particleGap = 3,
  mouseRadius = 100,
  mouseForce = 2,
  returnSpeed = 0.1,
  friction = 0.95,
  ease = 0.1,
  hover = true,
  explode = false,
  wave = false,
  waveSpeed = 0.002,
  waveAmplitude = 20,
  interactive = true,
  density = 1,
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<TextParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const waveOffsetRef = useRef(0);
  const [isExploded, setIsExploded] = useState(false);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initializeParticles();
    };

    // Initialize particles from text
    const initializeParticles = () => {
      particlesRef.current = [];

      // Create temporary canvas to get text pixels
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Measure text
      tempCtx.font = font;
      const textMetrics = tempCtx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize * 1.2;

      // Set temp canvas size
      tempCanvas.width = textWidth;
      tempCanvas.height = textHeight;

      // Draw text
      tempCtx.font = font;
      tempCtx.fillStyle = color;
      tempCtx.textBaseline = 'middle';
      tempCtx.fillText(text, 0, textHeight / 2);

      // Get image data
      const imageData = tempCtx.getImageData(0, 0, textWidth, textHeight);
      const data = imageData.data;

      // Calculate positions to center text
      const centerX = canvas.offsetWidth / 2 - textWidth / 2;
      const centerY = canvas.offsetHeight / 2 - textHeight / 2;

      // Create particles from pixels
      const gap = Math.max(1, Math.floor(particleGap / density));
      for (let y = 0; y < textHeight; y += gap) {
        for (let x = 0; x < textWidth; x += gap) {
          const index = (y * textWidth + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) {
            const particle: TextParticle = {
              x: centerX + x,
              y: centerY + y,
              originX: centerX + x,
              originY: centerY + y,
              vx: 0,
              vy: 0,
              size: particleSize,
              color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${alpha / 255})`,
              distance: 0,
            };
            particlesRef.current.push(particle);
          }
        }
      }
    };

    // Update particle
    const updateParticle = (particle: TextParticle) => {
      // Mouse interaction
      if (interactive && mouseRef.current.x > 0) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        particle.distance = distance;

        if (distance < mouseRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / mouseRadius) * mouseForce;

          if (hover) {
            // Repel particles
            particle.vx -= Math.cos(angle) * force;
            particle.vy -= Math.sin(angle) * force;
          } else {
            // Attract particles
            particle.vx += Math.cos(angle) * force;
            particle.vy += Math.sin(angle) * force;
          }
        }
      }

      // Explode effect
      if (explode && isExploded) {
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 10 + 5;
        particle.vx = Math.cos(angle) * force;
        particle.vy = Math.sin(angle) * force;
      }

      // Wave effect
      if (wave) {
        const waveY = Math.sin(particle.originX * 0.01 + waveOffsetRef.current) * waveAmplitude;
        particle.y = particle.originY + waveY;
      }

      // Return to origin
      if (!isExploded) {
        const dx = particle.originX - particle.x;
        const dy = particle.originY - particle.y;
        particle.vx += dx * returnSpeed;
        particle.vy += dy * returnSpeed;
      }

      // Apply friction
      particle.vx *= friction;
      particle.vy *= friction;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
    };

    // Draw particle
    const drawParticle = (particle: TextParticle) => {
      ctx.save();

      // Apply some alpha based on distance from mouse
      let alpha = 1;
      if (interactive && particle.distance > 0 && particle.distance < mouseRadius * 2) {
        alpha = 1 - (particle.distance - mouseRadius) / mouseRadius;
        alpha = Math.max(0.3, Math.min(1, alpha));
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      // Clear canvas
      if (backgroundColor === 'transparent') {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      }

      // Update wave offset
      if (wave) {
        waveOffsetRef.current += waveSpeed;
      }

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        updateParticle(particle);
        drawParticle(particle);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleClick = () => {
      if (explode) {
        setIsExploded(!isExploded);
      }
    };

    // Initialize
    resizeCanvas();
    animationFrameRef.current = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      if (explode) {
        canvas.addEventListener('click', handleClick);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [
    text,
    font,
    fontSize,
    color,
    backgroundColor,
    particleSize,
    particleGap,
    mouseRadius,
    mouseForce,
    returnSpeed,
    friction,
    ease,
    hover,
    explode,
    wave,
    waveSpeed,
    waveAmplitude,
    interactive,
    density,
    isExploded,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full cursor-pointer', className)}
      style={{ background: backgroundColor }}
    />
  );
}
