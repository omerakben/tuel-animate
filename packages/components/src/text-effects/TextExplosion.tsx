import { cn } from '@tuel/utils';
import { useEffect, useRef, useState } from 'react';

// Types for Matter.js (we'll import dynamically to avoid SSR issues)
interface MatterEngine {
  world: any;
  render: any;
  runner: any;
}

export interface TextExplosionProps {
  text: string;
  className?: string;
  trigger?: 'click' | 'hover' | 'scroll' | 'auto';
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  color?: string;
  explosionForce?: number;
  gravity?: number;
  restitution?: number;
  friction?: number;
  airFriction?: number;
  reset?: boolean;
  onExplosion?: () => void;
  onReset?: () => void;
}

export function TextExplosion({
  text,
  className,
  trigger = 'click',
  fontSize = 48,
  fontFamily = 'Arial, sans-serif',
  fontWeight = 'bold',
  color = '#000000',
  explosionForce = 0.1,
  gravity = 1,
  restitution = 0.8,
  friction = 0.001,
  airFriction = 0.01,
  reset = false,
  onExplosion,
  onReset,
}: TextExplosionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MatterEngine | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadMatter = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const Matter = await import('matter-js');
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (!canvas || !container) return;

        // Set canvas size
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Create engine
        const engine = Matter.Engine.create();
        engine.world.gravity.y = gravity;

        // Create renderer
        const render = Matter.Render.create({
          canvas,
          engine,
          options: {
            width: canvas.width,
            height: canvas.height,
            wireframes: false,
            background: 'transparent',
            showVelocity: false,
            showAngleIndicator: false,
            showDebug: false,
          },
        });

        // Create runner
        const runner = Matter.Runner.create();

        // Store references
        engineRef.current = { world: engine.world, render, runner };

        // Create text bodies
        createTextBodies(Matter, engine, canvas, text);

        // Start engine and renderer
        Matter.Render.run(render);
        Matter.Runner.run(runner, engine);

        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load Matter.js:', error);
      }
    };

    loadMatter();

    return () => {
      if (engineRef.current) {
        // Clean up Matter.js
        const { render, runner } = engineRef.current;
        if (render) {
          render.canvas.remove();
          render.canvas = null;
          render.context = null;
          render.textures = {};
        }
        if (runner) {
          runner.enabled = false;
        }
      }
    };
  }, [text, fontSize, fontFamily, fontWeight, color, gravity]);

  const createTextBodies = async (
    Matter: any,
    engine: any,
    canvas: HTMLCanvasElement,
    textContent: string
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create individual letter bodies
    const letters = textContent.split('');
    const letterWidth = fontSize * 0.6;
    const totalWidth = letters.length * letterWidth;
    const startX = centerX - totalWidth / 2;

    letters.forEach((letter, index) => {
      if (letter === ' ') return;

      const x = startX + index * letterWidth;
      const y = centerY;

      const body = Matter.Bodies.rectangle(x, y, letterWidth, fontSize, {
        restitution,
        friction,
        frictionAir: airFriction,
        render: {
          fillStyle: color,
        },
      });

      // Add custom text property
      (body as any).textContent = letter;

      Matter.World.add(engine.world, body);
    });

    // Add boundaries
    const thickness = 60;
    const boundaries = [
      // Bottom
      Matter.Bodies.rectangle(
        canvas.width / 2,
        canvas.height + thickness / 2,
        canvas.width,
        thickness,
        {
          isStatic: true,
          render: { fillStyle: 'transparent' },
        }
      ),
      // Left
      Matter.Bodies.rectangle(-thickness / 2, canvas.height / 2, thickness, canvas.height, {
        isStatic: true,
        render: { fillStyle: 'transparent' },
      }),
      // Right
      Matter.Bodies.rectangle(
        canvas.width + thickness / 2,
        canvas.height / 2,
        thickness,
        canvas.height,
        {
          isStatic: true,
          render: { fillStyle: 'transparent' },
        }
      ),
    ];

    Matter.World.add(engine.world, boundaries);
  };

  const explodeText = async () => {
    if (!engineRef.current || isExploded) return;

    try {
      const Matter = await import('matter-js');
      const { world } = engineRef.current;

      // Apply random forces to all bodies
      world.bodies.forEach((body: any) => {
        if (body.textContent) {
          const forceX = (Math.random() - 0.5) * explosionForce;
          const forceY = (Math.random() - 0.5) * explosionForce;
          Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY });
        }
      });

      setIsExploded(true);
      onExplosion?.();
    } catch (error) {
      console.error('Failed to explode text:', error);
    }
  };

  const resetText = async () => {
    if (!engineRef.current) return;

    try {
      const Matter = await import('matter-js');
      const { world } = engineRef.current;

      // Remove all bodies
      Matter.World.clear(world, false);

      // Recreate text bodies
      const canvas = canvasRef.current;
      if (canvas) {
        await createTextBodies(Matter, { world }, canvas, text);
      }

      setIsExploded(false);
      onReset?.();
    } catch (error) {
      console.error('Failed to reset text:', error);
    }
  };

  useEffect(() => {
    if (reset && isExploded) {
      resetText();
    }
  }, [reset, isExploded]);

  useEffect(() => {
    if (trigger === 'auto' && isLoaded) {
      const timer = setTimeout(() => {
        explodeText();
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [trigger, isLoaded]);

  const handleInteraction = () => {
    if (trigger === 'click' || trigger === 'hover') {
      explodeText();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full cursor-pointer', className)}
      onClick={trigger === 'click' ? handleInteraction : undefined}
      onMouseEnter={trigger === 'hover' ? handleInteraction : undefined}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-black font-bold"
            data-font-size={fontSize}
            data-font-family={fontFamily}
            data-font-weight={fontWeight}
            data-color={color}
          >
            {text}
          </span>
        </div>
      )}
    </div>
  );
}
