import { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { cn, isClient } from '@tuel/utils';

export interface InfiniteMarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number; // pixels per second
  direction?: 'left' | 'right' | 'up' | 'down';
  pauseOnHover?: boolean;
  gap?: number; // gap between items in pixels
  gradient?: boolean;
  gradientWidth?: number;
  autoFill?: boolean;
  'aria-label'?: string;
}

export function InfiniteMarquee({
  children,
  className,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  gap = 24,
  gradient = true,
  gradientWidth = 10,
  autoFill = true,
  'aria-label': ariaLabel,
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [contentWidth, setContentWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const isHorizontal = direction === 'left' || direction === 'right';
  const isReverse = direction === 'right' || direction === 'down';

  useEffect(() => {
    if (!isClient || !contentRef.current) return;

    const updateDimensions = () => {
      if (contentRef.current) {
        setContentWidth(contentRef.current.scrollWidth);
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [children]);

  useEffect(() => {
    if (!contentWidth || !contentHeight) return;

    const distance = isHorizontal ? contentWidth : contentHeight;
    const duration = distance / speed;

    if (!isPaused) {
      const animationProperty = isHorizontal ? 'x' : 'y';
      const animationValues = isReverse ? [0, distance] : [-distance, 0];
      
      controls.start({
        [animationProperty]: animationValues,
        transition: {
          duration,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        },
      } as any);
    } else {
      controls.stop();
    }

    return () => {
      controls.stop();
    };
  }, [contentWidth, contentHeight, speed, direction, isPaused, controls, isHorizontal, isReverse]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const gradientMask = gradient
    ? {
        WebkitMaskImage: isHorizontal
          ? `linear-gradient(to right, transparent, black ${gradientWidth}%, black ${100 - gradientWidth}%, transparent)`
          : `linear-gradient(to bottom, transparent, black ${gradientWidth}%, black ${100 - gradientWidth}%, transparent)`,
        maskImage: isHorizontal
          ? `linear-gradient(to right, transparent, black ${gradientWidth}%, black ${100 - gradientWidth}%, transparent)`
          : `linear-gradient(to bottom, transparent, black ${gradientWidth}%, black ${100 - gradientWidth}%, transparent)`,
      }
    : {};

  const renderContent = () => {
    const content = (
      <div
        ref={contentRef}
        className={cn(
          'flex',
          isHorizontal ? 'flex-row' : 'flex-col',
          `gap-[${gap}px]`
        )}
        style={{ gap: `${gap}px` }}
      >
        {children}
      </div>
    );

    if (!autoFill) return content;

    // Duplicate content for seamless loop
    return (
      <>
        {content}
        <div
          className={cn(
            'flex',
            isHorizontal ? 'flex-row' : 'flex-col',
            `gap-[${gap}px]`
          )}
          style={{ gap: `${gap}px` }}
          aria-hidden="true"
        >
          {children}
        </div>
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'overflow-hidden',
        'relative',
        className
      )}
      style={gradientMask}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="marquee"
      aria-label={ariaLabel || 'Scrolling content'}
    >
      <motion.div
        animate={controls}
        className={cn(
          'flex',
          isHorizontal ? 'flex-row' : 'flex-col',
          'will-change-transform'
        )}
        style={{ gap: `${gap}px` }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
}