import { useGsapContext } from '@tuel/gsap';
import { animations } from '@tuel/tokens';
import { cn, isClient } from '@tuel/utils';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

if (isClient) {
  gsap.registerPlugin(Draggable);
}

export interface CarouselSlide {
  id: string;
  content: ReactNode;
  image?: string;
  title?: string;
  description?: string;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | '3d' | 'stack' | 'coverflow';
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  showIndicators?: boolean;
  showArrows?: boolean;
  draggable?: boolean;
  direction?: 'horizontal' | 'vertical';
  slidesPerView?: number;
  spacing?: number;
  onSlideChange?: (index: number) => void;
}

export function Carousel({
  slides,
  className,
  variant = 'slide',
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  showIndicators = true,
  showArrows = true,
  draggable = true,
  direction = 'horizontal',
  onSlideChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Handle slide change
  const goToSlide = useCallback(
    (index: number) => {
      let newIndex = index;

      if (loop) {
        if (index < 0) newIndex = slides.length - 1;
        else if (index >= slides.length) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(slides.length - 1, index));
      }

      setCurrentIndex(newIndex);
      onSlideChange?.(newIndex);
    },
    [loop, slides.length, onSlideChange]
  );

  // Auto play
  useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentIndex, autoPlay, autoPlayInterval, isDragging, goToSlide]);

  // Drag handlers
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const velocity = direction === 'horizontal' ? info.velocity.x : info.velocity.y;
    const offset = direction === 'horizontal' ? info.offset.x : info.offset.y;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
    }

    setIsDragging(false);
  };

  // Get animation variants
  const getSlideVariants = () => {
    switch (variant) {
      case 'fade':
        return {
          enter: { opacity: 0 },
          center: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'scale':
        return {
          enter: { opacity: 0, scale: 0.8 },
          center: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 },
        };
      case '3d':
        return {
          enter: (custom: number) => ({
            rotateY: custom > 0 ? 90 : -90,
            opacity: 0,
          }),
          center: {
            rotateY: 0,
            opacity: 1,
          },
          exit: (custom: number) => ({
            rotateY: custom > 0 ? -90 : 90,
            opacity: 0,
          }),
        };
      case 'stack':
        return {
          enter: { scale: 0.9, opacity: 0, zIndex: 0 },
          center: { scale: 1, opacity: 1, zIndex: 1 },
          exit: { scale: 1.1, opacity: 0, zIndex: 0 },
        };
      case 'coverflow':
        return {
          enter: (custom: number) => ({
            x: custom > 0 ? 300 : -300,
            rotateY: custom > 0 ? 45 : -45,
            scale: 0.8,
            opacity: 0.5,
          }),
          center: {
            x: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
          },
          exit: (custom: number) => ({
            x: custom > 0 ? -300 : 300,
            rotateY: custom > 0 ? -45 : 45,
            scale: 0.8,
            opacity: 0.5,
          }),
        };
      default: // slide
        return {
          enter: (custom: number) => ({
            x: direction === 'horizontal' ? (custom > 0 ? 1000 : -1000) : 0,
            y: direction === 'vertical' ? (custom > 0 ? 1000 : -1000) : 0,
          }),
          center: {
            x: 0,
            y: 0,
          },
          exit: (custom: number) => ({
            x: direction === 'horizontal' ? (custom > 0 ? -1000 : 1000) : 0,
            y: direction === 'vertical' ? (custom > 0 ? -1000 : 1000) : 0,
          }),
        };
    }
  };

  const slideVariants = getSlideVariants();
  const custom = currentIndex;

  // GSAP Draggable setup
  useGsapContext(
    (_ctx) => {
      if (!draggable || !isClient || variant === '3d') return;

      const container = containerRef.current;
      if (!container) return;

      Draggable.create(container, {
        type: direction === 'horizontal' ? 'x' : 'y',
        inertia: true,
        bounds: container.parentElement,
        onDragStart: () => setIsDragging(true),
        onDragEnd: function () {
          const distance = direction === 'horizontal' ? this.x : this.y;
          const threshold = 100;

          if (Math.abs(distance) > threshold) {
            if (distance > 0) {
              goToSlide(currentIndex - 1);
            } else {
              goToSlide(currentIndex + 1);
            }
          }

          gsap.to(container, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });

          setIsDragging(false);
        },
      });
    },
    [draggable, direction, variant, currentIndex]
  );

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Slides Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full"
        style={{ perspective: variant === '3d' || variant === 'coverflow' ? 1000 : undefined }}
      >
        <AnimatePresence mode="wait" custom={custom}>
          <motion.div
            key={currentIndex}
            custom={custom}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.5 },
              default: { duration: 0.7, ease: animations.easing.motion.easeInOut },
            }}
            drag={draggable && variant !== '3d' ? (direction === 'horizontal' ? 'x' : 'y') : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full h-full"
            style={{
              transformStyle:
                variant === '3d' || variant === 'coverflow' ? 'preserve-3d' : undefined,
            }}
          >
            {/* Slide Content */}
            <div className="w-full h-full">
              {slides[currentIndex].image && (
                <img
                  src={slides[currentIndex].image}
                  alt={slides[currentIndex].title || ''}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center">
                  {slides[currentIndex].title && (
                    <h2 className="text-3xl font-bold mb-4">{slides[currentIndex].title}</h2>
                  )}
                  {slides[currentIndex].description && (
                    <p className="text-lg opacity-90">{slides[currentIndex].description}</p>
                  )}
                  {slides[currentIndex].content}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={() => goToSlide(currentIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => goToSlide(currentIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex ? 'w-8 bg-white' : 'bg-white/50 hover:bg-white/70'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
