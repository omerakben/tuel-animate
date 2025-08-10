import { cn, isClient } from '@tuel/utils';
import { ReactNode, useEffect, useRef } from 'react';

export interface CanvasAnimationProps {
  className?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  fps?: number;
  autoPlay?: boolean;
  loop?: boolean;
  onFrame?: (ctx: CanvasRenderingContext2D, frame: number, time: number) => void;
  onInit?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  onResize?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  onMouseMove?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
  onMouseDown?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
  onMouseUp?: (ctx: CanvasRenderingContext2D, x: number, y: number) => void;
  children?: ReactNode;
}

export function CanvasAnimation({
  className,
  width,
  height,
  backgroundColor = 'transparent',
  fps = 60,
  autoPlay = true,
  loop = true,
  onFrame,
  onInit,
  onResize,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  children,
}: CanvasAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isPlayingRef = useRef(autoPlay);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const w = width || canvas.offsetWidth;
      const h = height || canvas.offsetHeight;

      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      onResize?.(ctx, w, h);
    };
    resizeCanvas();

    // Initialize
    onInit?.(ctx, canvas);

    // Animation loop
    const frameInterval = 1000 / fps;
    const animate = (time: number) => {
      if (!isPlayingRef.current) return;

      const deltaTime = time - lastTimeRef.current;

      if (deltaTime >= frameInterval) {
        // Clear canvas
        if (backgroundColor === 'transparent') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Call frame handler
        onFrame?.(ctx, frameRef.current, time);

        frameRef.current++;
        lastTimeRef.current = time;

        if (!loop && frameRef.current >= fps * 10) {
          isPlayingRef.current = false;
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    if (autoPlay) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onMouseMove?.(ctx, x, y);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onMouseDown?.(ctx, x, y);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onMouseUp?.(ctx, x, y);
    };

    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    if (onMouseMove) canvas.addEventListener('mousemove', handleMouseMove);
    if (onMouseDown) canvas.addEventListener('mousedown', handleMouseDown);
    if (onMouseUp) canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    width,
    height,
    backgroundColor,
    fps,
    autoPlay,
    loop,
    onFrame,
    onInit,
    onResize,
    onMouseMove,
    onMouseDown,
    onMouseUp,
  ]);

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ background: backgroundColor }}
      />
      {children && <div className="absolute inset-0 pointer-events-none">{children}</div>}
    </div>
  );
}
