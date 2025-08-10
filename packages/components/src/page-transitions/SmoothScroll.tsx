import { ReactNode, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';

if (isClient) {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SmoothScrollProps {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
  lerp?: number;
  duration?: number;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal' | 'both';
  smooth?: boolean;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
  autoRaf?: boolean;
  wrapper?: HTMLElement | null;
  content?: HTMLElement | null;
  onScroll?: (data: { scroll: number; progress: number; velocity: number }) => void;
}

export function SmoothScroll({
  children,
  className,
  enabled = true,
  lerp = 0.1,
  duration = 1.2,
  orientation = 'vertical',
  gestureOrientation = 'vertical',
  smooth = true,
  smoothTouch = false,
  touchMultiplier = 2,
  infinite = false,
  autoRaf = true,
  wrapper,
  content,
  onScroll,
}: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({
    current: 0,
    target: 0,
    velocity: 0,
    progress: 0,
  });
  const rafRef = useRef<number>();

  useGsapContext((ctx) => {
    if (!isClient || !enabled) return;

    const wrapperEl = wrapper || wrapperRef.current;
    const contentEl = content || contentRef.current;
    if (!wrapperEl || !contentEl) return;

    // Set up wrapper styles
    gsap.set(wrapperEl, {
      overflow: 'hidden',
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    });

    // Set up content styles
    gsap.set(contentEl, {
      position: 'relative',
      width: orientation === 'horizontal' ? 'auto' : '100%',
      height: orientation === 'vertical' ? 'auto' : '100%',
    });

    // Create invisible scrollbar element for native scroll
    const scrollElement = document.createElement('div');
    scrollElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: ${orientation === 'vertical' ? contentEl.scrollHeight + 'px' : '100%'};
      pointer-events: none;
      visibility: hidden;
    `;
    document.body.appendChild(scrollElement);

    // Update scroll position
    const updateScroll = () => {
      const scrollMax =
        orientation === 'vertical'
          ? contentEl.scrollHeight - window.innerHeight
          : contentEl.scrollWidth - window.innerWidth;

      scrollRef.current.target = window.scrollY;
      scrollRef.current.progress = scrollRef.current.target / scrollMax;

      if (smooth) {
        scrollRef.current.velocity =
          scrollRef.current.target - scrollRef.current.current;
        scrollRef.current.current +=
          scrollRef.current.velocity * lerp;
      } else {
        scrollRef.current.current = scrollRef.current.target;
      }

      // Apply transform
      if (orientation === 'vertical') {
        gsap.set(contentEl, {
          y: -scrollRef.current.current,
        });
      } else {
        gsap.set(contentEl, {
          x: -scrollRef.current.current,
        });
      }

      // Trigger callback
      onScroll?.({
        scroll: scrollRef.current.current,
        progress: scrollRef.current.progress,
        velocity: scrollRef.current.velocity,
      });

      // Update ScrollTrigger
      ScrollTrigger.update();
    };

    // Animation loop
    const raf = () => {
      updateScroll();
      rafRef.current = requestAnimationFrame(raf);
    };

    if (autoRaf) {
      rafRef.current = requestAnimationFrame(raf);
    }

    // Handle wheel events
    const handleWheel = (e: WheelEvent) => {
      if (!smooth) return;

      const delta = e.deltaY;
      const speed = touchMultiplier;

      if (orientation === 'vertical') {
        window.scrollTo(0, window.scrollY + delta * speed);
      } else {
        window.scrollTo(window.scrollX + delta * speed, 0);
      }
    };

    // Handle touch events for smooth touch scrolling
    let touchStart = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (!smoothTouch) return;
      touchStart =
        orientation === 'vertical' ? e.touches[0].clientY : e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!smoothTouch) return;
      const touchCurrent =
        orientation === 'vertical' ? e.touches[0].clientY : e.touches[0].clientX;
      const delta = touchStart - touchCurrent;
      touchStart = touchCurrent;

      if (orientation === 'vertical') {
        window.scrollTo(0, window.scrollY + delta * touchMultiplier);
      } else {
        window.scrollTo(window.scrollX + delta * touchMultiplier, 0);
      }
    };

    // Set up ScrollTrigger
    ScrollTrigger.scrollerProxy(wrapperEl, {
      scrollTop(value) {
        if (arguments.length) {
          scrollRef.current.current = scrollRef.current.target = Number(value);
        }
        return scrollRef.current.current;
      },
      scrollLeft(value) {
        if (arguments.length) {
          scrollRef.current.current = scrollRef.current.target = Number(value);
        }
        return scrollRef.current.current;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        } as DOMRect;
      },
    });

    // Add event listeners
    if (smooth) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }
    if (smoothTouch) {
      window.addEventListener('touchstart', handleTouchStart, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    // Handle resize
    const handleResize = () => {
      scrollElement.style.height =
        orientation === 'vertical' ? contentEl.scrollHeight + 'px' : '100%';
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.body.removeChild(scrollElement);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.killAll();
    };
  }, [
    enabled,
    lerp,
    duration,
    orientation,
    smooth,
    smoothTouch,
    touchMultiplier,
    autoRaf,
  ]);

  return (
    <div ref={wrapperRef} className={cn('smooth-scroll-wrapper', className)}>
      <div ref={contentRef} className="smooth-scroll-content">
        {children}
      </div>
    </div>
  );
}