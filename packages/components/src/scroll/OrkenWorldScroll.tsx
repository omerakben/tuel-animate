'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface OrkenWorldScrollProps {
  className?: string;
}

interface TriangleState {
  order: number;
  scale: number;
  row: number;
  col: number;
}

interface CardData {
  id: number;
  title: string;
  productCode: string;
  image: string;
}

const defaultCards: CardData[] = [
  {
    id: 1,
    title: 'Silent Veil',
    productCode: 'PROD8372',
    image:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjY2NjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzMzMzMzMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+',
  },
  {
    id: 2,
    title: 'Crimson Echoes',
    productCode: 'PROD4921',
    image:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNkYzI2MjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5OTE5MTkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+',
  },
  {
    id: 3,
    title: 'Zenith Arc',
    productCode: 'PROD7586',
    image:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyNTYzZWIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZTQwYWYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+',
  },
];

export default function OrkenWorldScroll({ className = '' }: OrkenWorldScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const fillCanvasRef = useRef<HTMLCanvasElement>(null);

  const triangleStatesRef = useRef<Map<string, TriangleState>>(new Map());
  const animationFrameIdRef = useRef<number | null>(null);
  const canvasXPositionRef = useRef<number>(0);

  const triangleSize = 150;
  const lineWidth = 1;
  const SCALE_THRESHOLD = 0.01;

  const setCanvasSize = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
  };

  const drawTriangle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    fillScale = 0,
    flipped = false
  ) => {
    const halfSize = triangleSize / 2;

    if (fillScale < SCALE_THRESHOLD) {
      ctx.beginPath();
      if (!flipped) {
        ctx.moveTo(x, y - halfSize);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.lineTo(x - halfSize, y + halfSize);
      } else {
        ctx.moveTo(x, y + halfSize);
        ctx.lineTo(x + halfSize, y - halfSize);
        ctx.lineTo(x - halfSize, y - halfSize);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.075)';
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    if (fillScale >= SCALE_THRESHOLD) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(fillScale, fillScale);
      ctx.translate(-x, -y);

      ctx.beginPath();
      if (!flipped) {
        ctx.moveTo(x, y - halfSize);
        ctx.lineTo(x + halfSize, y + halfSize);
        ctx.lineTo(x - halfSize, y + halfSize);
      } else {
        ctx.moveTo(x, y + halfSize);
        ctx.lineTo(x + halfSize, y - halfSize);
        ctx.lineTo(x - halfSize, y - halfSize);
      }
      ctx.closePath();
      ctx.fillStyle = '#ff6b00';
      ctx.strokeStyle = '#ff6b00';
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  };

  const drawGrid = (scrollProgress = 0) => {
    const outlineCanvas = outlineCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;

    if (!outlineCanvas || !fillCanvas) return;

    const outlineCtx = outlineCanvas.getContext('2d');
    const fillCtx = fillCanvas.getContext('2d');

    if (!outlineCtx || !fillCtx) return;

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    outlineCtx.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
    fillCtx.clearRect(0, 0, fillCanvas.width, fillCanvas.height);

    const animationProgress = scrollProgress <= 0.65 ? 0 : (scrollProgress - 0.65) / 0.35;
    let needsUpdate = false;
    const animationSpeed = 0.15;

    // Draw outline triangles
    triangleStatesRef.current.forEach((state) => {
      if (state.scale < 1) {
        const x = state.col * (triangleSize * 0.5) + triangleSize / 2 + canvasXPositionRef.current;
        const y = state.row * triangleSize + triangleSize / 2;
        const flipped = (state.row + state.col) % 2 !== 0;
        drawTriangle(outlineCtx, x, y, 0, flipped);
      }
    });

    // Draw filled triangles
    triangleStatesRef.current.forEach((state) => {
      const shouldBeVisible = state.order <= animationProgress;
      const targetScale = shouldBeVisible ? 1 : 0;
      const newScale = state.scale + (targetScale - state.scale) * animationSpeed;

      if (Math.abs(newScale - state.scale) > 0.001) {
        state.scale = newScale;
        needsUpdate = true;
      }

      if (state.scale >= SCALE_THRESHOLD) {
        const x = state.col * (triangleSize * 0.5) + triangleSize / 2 + canvasXPositionRef.current;
        const y = state.row * triangleSize + triangleSize / 2;
        const flipped = (state.row + state.col) % 2 !== 0;
        drawTriangle(fillCtx, x, y, state.scale, flipped);
      }
    });

    if (needsUpdate) {
      animationFrameIdRef.current = requestAnimationFrame(() => drawGrid(scrollProgress));
    }
  };

  const initializeTriangles = () => {
    const cols = Math.ceil(window.innerWidth / (triangleSize * 0.5));
    const rows = Math.ceil(window.innerHeight / (triangleSize * 0.5));
    const totalTriangles = rows * cols;

    const positions = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions.push({ row: r, col: c, key: `${r}-${c}` });
      }
    }

    // Shuffle positions for random animation order
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    triangleStatesRef.current.clear();
    positions.forEach((pos, index) => {
      triangleStatesRef.current.set(pos.key, {
        order: index / totalTriangles,
        scale: 0,
        row: pos.row,
        col: pos.col,
      });
    });
  };

  useEffect(() => {
    const outlineCanvas = outlineCanvasRef.current;
    const fillCanvas = fillCanvasRef.current;
    const stickySection = stickyRef.current;
    const cards = cardsRef.current;

    if (!outlineCanvas || !fillCanvas || !stickySection || !cards) return;

    const outlineCtx = outlineCanvas.getContext('2d');
    const fillCtx = fillCanvas.getContext('2d');

    if (!outlineCtx || !fillCtx) return;

    // Setup canvas
    setCanvasSize(outlineCanvas, outlineCtx);
    setCanvasSize(fillCanvas, fillCtx);

    // Initialize triangles
    initializeTriangles();
    drawGrid();

    const stickyHeight = window.innerHeight * 5;

    // ScrollTrigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: 'top top',
      end: `+=${stickyHeight}px`,
      pin: true,
      onUpdate: (self) => {
        canvasXPositionRef.current = -self.progress * 200;
        drawGrid(self.progress);

        // Move cards horizontally
        const progress = Math.min(self.progress / 0.654, 1);
        gsap.set(cards, {
          x: -progress * window.innerWidth * 2,
        });
      },
    });

    // Handle resize
    const handleResize = () => {
      setCanvasSize(outlineCanvas, outlineCtx);
      setCanvasSize(fillCanvas, fillCtx);
      triangleStatesRef.current.clear();
      initializeTriangles();
      drawGrid();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      scrollTrigger.kill();
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${className}`}
      style={{ height: '800vh', fontFamily: '"PP Neue Montreal", sans-serif' }}
    >
      {/* Hero Section */}
      <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center bg-black text-white">
        <h1 className="text-center text-4xl md:text-6xl lg:text-[80px] uppercase font-light leading-none">
          <span className="text-orange-500">Enter a Universe</span> Powered by Imagination
        </h1>
      </section>

      {/* Sticky Section */}
      <section ref={stickyRef} className="relative w-screen h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>

        <canvas
          ref={outlineCanvasRef}
          className="absolute top-0 left-0 z-[1]"
          style={{ width: '150%', height: '150%' }}
        />

        <div
          ref={cardsRef}
          className="absolute top-0 left-0 w-[300%] h-screen flex justify-around items-center z-[2]"
          style={{ willChange: 'transform' }}
        >
          {defaultCards.map((card) => (
            <div
              key={card.id}
              className="relative w-[10%] h-[75%] bg-black rounded-xl overflow-hidden flex flex-col"
            >
              <div className="flex-1 w-full">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-5 left-5 text-white">
                <h1 className="text-2xl mb-1 font-light uppercase">{card.title}</h1>
                <p className="text-sm opacity-70 font-medium">{card.productCode}</p>
              </div>
            </div>
          ))}
        </div>

        <canvas
          ref={fillCanvasRef}
          className="absolute top-0 left-0 z-[3]"
          style={{ width: '150%', height: '150%' }}
        />
      </section>

      {/* Outro Section */}
      <section className="relative w-screen h-screen overflow-hidden flex justify-center items-center bg-black text-white">
        <h1 className="text-center text-4xl md:text-6xl lg:text-[80px] uppercase font-light leading-none">
          Chase the <span className="text-orange-500">shadows</span> to embrace the light
        </h1>
      </section>
    </div>
  );
}
