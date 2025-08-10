import { cn, isClient } from '@tuel/utils';
import { useEffect, useRef } from 'react';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

export interface ParticleFieldProps {
  className?: string;
  count?: number;
  minRadius?: number;
  maxRadius?: number;
  speed?: number;
  colors?: string[];
  backgroundColor?: string;
  connectionDistance?: number;
  mouseInteraction?: boolean;
  mouseRadius?: number;
  mouseForce?: number;
  gravity?: number;
  bounce?: boolean;
  wrap?: boolean;
  shape?: 'circle' | 'square' | 'triangle' | 'star';
  emitRate?: number;
  lifetime?: number;
  direction?: { x: number; y: number };
  spread?: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
}

export function ParticleField({
  className,
  count = 100,
  minRadius = 1,
  maxRadius = 3,
  speed = 1,
  colors = ['#ffffff', '#888888', '#666666'],
  backgroundColor = 'transparent',
  connectionDistance = 100,
  mouseInteraction = true,
  mouseRadius = 100,
  mouseForce = 0.1,
  gravity = 0,
  bounce = false,
  wrap = true,
  shape = 'circle',
  emitRate = 0,
  lifetime = 0,
  direction = { x: 0, y: 0 },
  spread = Math.PI * 2,
  fadeIn = true,
  fadeOut = true,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const emitTimerRef = useRef(0);

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

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    // Create a particle
    const createParticle = (x?: number, y?: number): Particle => {
      const angle =
        direction.x === 0 && direction.y === 0
          ? Math.random() * Math.PI * 2
          : Math.atan2(direction.y, direction.x) + (Math.random() - 0.5) * spread;

      const velocity = speed * (0.5 + Math.random() * 0.5);

      return {
        x: x ?? Math.random() * canvas.offsetWidth,
        y: y ?? Math.random() * canvas.offsetHeight,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        radius: minRadius + Math.random() * (maxRadius - minRadius),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: fadeIn ? 0 : 1,
        life: 0,
        maxLife: lifetime > 0 ? lifetime : Infinity,
      };
    };

    // Draw particle shape
    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.translate(particle.x, particle.y);

      switch (shape) {
        case 'square':
          ctx.fillRect(
            -particle.radius,
            -particle.radius,
            particle.radius * 2,
            particle.radius * 2
          );
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -particle.radius);
          ctx.lineTo(-particle.radius, particle.radius);
          ctx.lineTo(particle.radius, particle.radius);
          ctx.closePath();
          ctx.fill();
          break;
        case 'star':
          const spikes = 5;
          const outerRadius = particle.radius;
          const innerRadius = particle.radius * 0.5;
          ctx.beginPath();
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
          break;
        default: // circle
          ctx.beginPath();
          ctx.arc(0, 0, particle.radius, 0, Math.PI * 2);
          ctx.fill();
      }

      ctx.restore();
    };

    // Update particle position
    const updateParticle = (particle: Particle, deltaTime: number) => {
      // Apply gravity
      particle.vy += gravity * deltaTime;

      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      // Update life
      particle.life += deltaTime;

      // Fade in/out
      if (fadeIn && particle.life < 1) {
        particle.opacity = particle.life;
      } else if (fadeOut && particle.maxLife !== Infinity && particle.life > particle.maxLife - 1) {
        particle.opacity = particle.maxLife - particle.life;
      } else {
        particle.opacity = 1;
      }

      // Boundary behavior
      if (bounce) {
        if (particle.x <= particle.radius || particle.x >= canvas.offsetWidth - particle.radius) {
          particle.vx *= -0.9;
          particle.x = Math.max(
            particle.radius,
            Math.min(canvas.offsetWidth - particle.radius, particle.x)
          );
        }
        if (particle.y <= particle.radius || particle.y >= canvas.offsetHeight - particle.radius) {
          particle.vy *= -0.9;
          particle.y = Math.max(
            particle.radius,
            Math.min(canvas.offsetHeight - particle.radius, particle.y)
          );
        }
      } else if (wrap) {
        if (particle.x < -particle.radius) particle.x = canvas.offsetWidth + particle.radius;
        if (particle.x > canvas.offsetWidth + particle.radius) particle.x = -particle.radius;
        if (particle.y < -particle.radius) particle.y = canvas.offsetHeight + particle.radius;
        if (particle.y > canvas.offsetHeight + particle.radius) particle.y = -particle.radius;
      }

      // Mouse interaction
      if (mouseInteraction && mouseRef.current.x > 0) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const force = (1 - distance / mouseRadius) * mouseForce;
          particle.vx -= (dx / distance) * force;
          particle.vy -= (dy / distance) * force;
        }
      }
    };

    // Draw connections between particles
    const drawConnections = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.globalAlpha =
              (1 - distance / connectionDistance) * 0.5 * Math.min(p1.opacity, p2.opacity);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    // Animation loop
    let lastTime = 0;
    const animate = (time: number) => {
      const deltaTime = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Clear canvas
      if (backgroundColor === 'transparent') {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      }

      // Emit new particles
      if (emitRate > 0) {
        emitTimerRef.current += deltaTime;
        const emitInterval = 1 / emitRate;
        while (emitTimerRef.current > emitInterval) {
          emitTimerRef.current -= emitInterval;
          particlesRef.current.push(
            createParticle(canvas.offsetWidth / 2, canvas.offsetHeight / 2)
          );
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        updateParticle(particle, deltaTime * 60);

        // Remove dead particles
        if (particle.maxLife !== Infinity && particle.life > particle.maxLife) {
          return false;
        }
        if (
          !wrap &&
          !bounce &&
          (particle.x < -particle.radius - 100 ||
            particle.x > canvas.offsetWidth + particle.radius + 100 ||
            particle.y < -particle.radius - 100 ||
            particle.y > canvas.offsetHeight + particle.radius + 100)
        ) {
          return false;
        }

        drawParticle(particle);
        return true;
      });

      // Draw connections
      if (connectionDistance > 0) {
        drawConnections();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Mouse move handler
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

    // Initialize and start
    initParticles();
    animationFrameRef.current = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    if (mouseInteraction) {
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
    count,
    minRadius,
    maxRadius,
    speed,
    colors,
    backgroundColor,
    connectionDistance,
    mouseInteraction,
    mouseRadius,
    mouseForce,
    gravity,
    bounce,
    wrap,
    shape,
    emitRate,
    lifetime,
    direction,
    spread,
    fadeIn,
    fadeOut,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full', className)}
      style={{ background: backgroundColor }}
    />
  );
}
