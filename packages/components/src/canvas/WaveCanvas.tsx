import { useRef, useEffect } from 'react';
import { cn, isClient } from '@tuel/utils';

export interface Wave {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  color: string;
  lineWidth: number;
  opacity: number;
}

export interface WaveCanvasProps {
  className?: string;
  waves?: Wave[];
  backgroundColor?: string;
  resolution?: number;
  fillMode?: boolean;
  gradient?: boolean;
  gradientColors?: string[];
  interactive?: boolean;
  mouseInfluence?: number;
  autoPlay?: boolean;
  blur?: number;
  glow?: boolean;
  glowIntensity?: number;
}

export function WaveCanvas({
  className,
  waves = [
    { amplitude: 50, frequency: 0.01, speed: 0.02, phase: 0, color: '#3b82f6', lineWidth: 2, opacity: 1 },
    { amplitude: 30, frequency: 0.02, speed: 0.03, phase: Math.PI / 4, color: '#8b5cf6', lineWidth: 2, opacity: 0.8 },
    { amplitude: 20, frequency: 0.03, speed: 0.04, phase: Math.PI / 2, color: '#ec4899', lineWidth: 2, opacity: 0.6 },
  ],
  backgroundColor = 'transparent',
  resolution = 2,
  fillMode = false,
  gradient = false,
  gradientColors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  interactive = true,
  mouseInfluence = 50,
  autoPlay = true,
  blur = 0,
  glow = false,
  glowIntensity = 20,
}: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isPlayingRef = useRef(autoPlay);

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
    };
    resizeCanvas();

    // Draw wave
    const drawWave = (wave: Wave, index: number) => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerY = height / 2;

      ctx.beginPath();
      
      // Create gradient if needed
      if (gradient && gradientColors.length > 0) {
        const grad = ctx.createLinearGradient(0, centerY - wave.amplitude, 0, centerY + wave.amplitude);
        gradientColors.forEach((color, i) => {
          grad.addColorStop(i / (gradientColors.length - 1), color);
        });
        ctx.strokeStyle = grad;
        ctx.fillStyle = grad;
      } else {
        ctx.strokeStyle = wave.color;
        ctx.fillStyle = wave.color;
      }

      ctx.lineWidth = wave.lineWidth;
      ctx.globalAlpha = wave.opacity;

      // Apply glow effect
      if (glow) {
        ctx.shadowColor = wave.color;
        ctx.shadowBlur = glowIntensity;
      }

      // Draw wave path
      for (let x = 0; x <= width; x += resolution) {
        // Calculate base wave
        let y = centerY + Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) * wave.amplitude;
        
        // Add mouse influence
        if (interactive && mouseRef.current.x > 0) {
          const distance = Math.abs(x - mouseRef.current.x);
          if (distance < mouseInfluence * 2) {
            const influence = (1 - distance / (mouseInfluence * 2)) * mouseInfluence;
            y += Math.sin(timeRef.current * 0.05) * influence * Math.sign(mouseRef.current.y - centerY);
          }
        }

        // Add secondary harmonics for complexity
        y += Math.sin(x * wave.frequency * 2 + timeRef.current * wave.speed * 1.5) * wave.amplitude * 0.3;
        y += Math.sin(x * wave.frequency * 3 + timeRef.current * wave.speed * 0.5) * wave.amplitude * 0.1;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      if (fillMode) {
        // Complete the path for fill
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.stroke();
      }

      // Reset shadow
      if (glow) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
    };

    // Animation loop
    const animate = () => {
      if (!isPlayingRef.current) return;

      // Clear canvas
      if (backgroundColor === 'transparent') {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      }

      // Apply blur filter if needed
      if (blur > 0) {
        ctx.filter = `blur(${blur}px)`;
      }

      // Draw waves
      waves.forEach((wave, index) => {
        drawWave(wave, index);
      });

      // Reset filter
      if (blur > 0) {
        ctx.filter = 'none';
      }

      timeRef.current += 1;
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

    // Start animation
    if (autoPlay) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    waves,
    backgroundColor,
    resolution,
    fillMode,
    gradient,
    gradientColors,
    interactive,
    mouseInfluence,
    autoPlay,
    blur,
    glow,
    glowIntensity,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full', className)}
      style={{ background: backgroundColor }}
    />
  );
}