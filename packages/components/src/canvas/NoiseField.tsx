import { useRef, useEffect } from 'react';
import { cn, isClient } from '@tuel/utils';

export interface NoiseFieldProps {
  className?: string;
  backgroundColor?: string;
  particleCount?: number;
  particleSize?: number;
  particleColor?: string;
  noiseScale?: number;
  noiseSpeed?: number;
  noiseStrength?: number;
  fadeTrails?: boolean;
  trailLength?: number;
  colorMode?: 'monochrome' | 'gradient' | 'rainbow' | 'custom';
  gradientColors?: string[];
  interactive?: boolean;
  mouseRadius?: number;
  mouseStrength?: number;
  flowField?: boolean;
  turbulence?: number;
}

export function NoiseField({
  className,
  backgroundColor = '#000000',
  particleCount = 1000,
  particleSize = 1,
  particleColor = '#ffffff',
  noiseScale = 0.003,
  noiseSpeed = 0.001,
  noiseStrength = 1,
  fadeTrails = true,
  trailLength = 0.98,
  colorMode = 'monochrome',
  gradientColors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  interactive = true,
  mouseRadius = 150,
  mouseStrength = 2,
  flowField = true,
  turbulence = 1,
}: NoiseFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simplex noise implementation
    class SimplexNoise {
      private grad3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
      ];
      private p: number[] = [];
      private perm: number[] = [];

      constructor() {
        for (let i = 0; i < 256; i++) {
          this.p[i] = Math.floor(Math.random() * 256);
        }
        for (let i = 0; i < 512; i++) {
          this.perm[i] = this.p[i & 255];
        }
      }

      dot(g: number[], x: number, y: number): number {
        return g[0] * x + g[1] * y;
      }

      noise2D(xin: number, yin: number): number {
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        
        let i1: number, j1: number;
        if (x0 > y0) {
          i1 = 1; j1 = 0;
        } else {
          i1 = 0; j1 = 1;
        }
        
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        
        const ii = i & 255;
        const jj = j & 255;
        const gi0 = this.perm[ii + this.perm[jj]] % 12;
        const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
        const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
        
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        let n0 = 0;
        if (t0 >= 0) {
          t0 *= t0;
          n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
        }
        
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        let n1 = 0;
        if (t1 >= 0) {
          t1 *= t1;
          n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
        }
        
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        let n2 = 0;
        if (t2 >= 0) {
          t2 *= t2;
          n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
        }
        
        return 70.0 * (n0 + n1 + n2);
      }
    }

    const noise = new SimplexNoise();

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;

      constructor(canvas: HTMLCanvasElement) {
        this.reset(canvas);
        this.vx = 0;
        this.vy = 0;
        this.size = particleSize;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
      }

      reset(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.offsetWidth;
        this.y = Math.random() * canvas.offsetHeight;
        this.life = 0;
      }

      update(canvas: HTMLCanvasElement) {
        // Get noise value
        const n = noise.noise2D(
          this.x * noiseScale + timeRef.current * noiseSpeed,
          this.y * noiseScale + timeRef.current * noiseSpeed
        );
        
        // Calculate angle from noise
        let angle = n * Math.PI * 2 * turbulence;
        
        // Apply flow field
        if (flowField) {
          const flowAngle = noise.noise2D(
            this.x * noiseScale * 0.5,
            this.y * noiseScale * 0.5
          ) * Math.PI * 2;
          angle = (angle + flowAngle) / 2;
        }
        
        // Calculate velocity from angle
        this.vx = Math.cos(angle) * noiseStrength;
        this.vy = Math.sin(angle) * noiseStrength;
        
        // Mouse interaction
        if (interactive && mouseRef.current.x > 0) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRadius) {
            const force = (1 - distance / mouseRadius) * mouseStrength;
            this.vx += (dx / distance) * force;
            this.vy += (dy / distance) * force;
          }
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Update life
        this.life++;
        
        // Wrap around edges or reset
        if (this.x < 0 || this.x > canvas.offsetWidth ||
            this.y < 0 || this.y > canvas.offsetHeight ||
            this.life > this.maxLife) {
          this.reset(canvas);
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Calculate color based on mode
        let color = particleColor;
        
        switch (colorMode) {
          case 'gradient':
            if (gradientColors.length > 0) {
              const index = (this.life / this.maxLife) * (gradientColors.length - 1);
              const i = Math.floor(index);
              const f = index - i;
              if (i < gradientColors.length - 1) {
                // Interpolate between colors
                const c1 = gradientColors[i];
                const c2 = gradientColors[i + 1];
                // Simple color interpolation (works for hex colors)
                color = c1; // Simplified for now
              } else {
                color = gradientColors[gradientColors.length - 1];
              }
            }
            break;
          case 'rainbow':
            const hue = (this.life * 2) % 360;
            color = `hsl(${hue}, 70%, 50%)`;
            break;
          case 'custom':
            const angle = Math.atan2(this.vy, this.vx);
            const hue2 = ((angle + Math.PI) / (Math.PI * 2)) * 360;
            color = `hsl(${hue2}, 70%, 50%)`;
            break;
        }
        
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.min(1, (this.maxLife - this.life) / 50);
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
      }
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Reinitialize particles
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle(canvas));
      }
    };
    resizeCanvas();

    // Animation loop
    const animate = () => {
      // Fade trails effect
      if (fadeTrails) {
        ctx.fillStyle = backgroundColor + Math.floor((1 - trailLength) * 255).toString(16).padStart(2, '0');
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      }
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(canvas);
        particle.draw(ctx);
      });
      
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
    animationFrameRef.current = requestAnimationFrame(animate);

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
    backgroundColor,
    particleCount,
    particleSize,
    particleColor,
    noiseScale,
    noiseSpeed,
    noiseStrength,
    fadeTrails,
    trailLength,
    colorMode,
    gradientColors,
    interactive,
    mouseRadius,
    mouseStrength,
    flowField,
    turbulence,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full', className)}
      style={{ background: backgroundColor }}
    />
  );
}