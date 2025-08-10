import { ReactNode, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { useGsapContext } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';

export interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'rotate' | 'blur' | 'clip' | 'mask' | 'morph' | 'split' | 'curtain';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
  trigger?: boolean;
  backgroundColor?: string;
  easing?: string;
}

export function PageTransition({
  children,
  className,
  variant = 'fade',
  direction = 'up',
  duration = 1,
  delay = 0,
  stagger = 0.1,
  onComplete,
  trigger = true,
  backgroundColor = 'bg-black',
  easing = 'power3.inOut',
}: PageTransitionProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const morphPathsRef = useRef<SVGPathElement[]>([]);

  useEffect(() => {
    if (trigger) {
      setIsRevealed(true);
    }
  }, [trigger]);

  // GSAP animations for complex transitions
  useGsapContext((ctx) => {
    if (!isClient || !containerRef.current || !trigger) return;

    if (variant === 'morph') {
      // Morph transition with SVG paths
      const paths = morphPathsRef.current;
      if (paths.length === 0) return;

      const tl = gsap.timeline({
        onComplete,
      });

      tl.set(paths, {
        attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' },
      })
        .to(
          paths,
          {
            attr: { d: 'M 0 100 V 50 Q 50 0 100 50 V 100 z' },
            duration: duration * 0.3,
            ease: 'power2.in',
            stagger,
          },
          0
        )
        .to(
          paths,
          {
            attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' },
            duration: duration * 0.7,
            ease: 'power2.out',
            stagger,
          },
          `-=${duration * 0.1}`
        );
    } else if (variant === 'split') {
      // Split screen transition
      const panels = containerRef.current.querySelectorAll('.split-panel');
      if (panels.length === 0) return;

      gsap.fromTo(
        panels,
        {
          scaleY: 0,
          transformOrigin: direction === 'up' ? 'bottom' : 'top',
        },
        {
          scaleY: 1,
          duration,
          ease: easing,
          stagger,
          onComplete,
        }
      );
    } else if (variant === 'curtain') {
      // Curtain reveal transition
      const curtains = containerRef.current.querySelectorAll('.curtain-panel');
      if (curtains.length === 0) return;

      const tl = gsap.timeline({
        onComplete,
      });

      tl.fromTo(
        curtains,
        {
          yPercent: direction === 'up' ? 100 : -100,
        },
        {
          yPercent: 0,
          duration: duration * 0.6,
          ease: 'power4.inOut',
          stagger: stagger * 0.5,
        }
      ).to(
        curtains,
        {
          yPercent: direction === 'up' ? -100 : 100,
          duration: duration * 0.4,
          ease: 'power2.in',
          stagger: stagger * 0.5,
        },
        `-=${duration * 0.2}`
      );
    }
  }, [variant, trigger, direction, duration, stagger, easing]);

  // Get animation variants for Framer Motion transitions
  const getVariants = (): Variants => {
    switch (variant) {
      case 'slide':
        const slideOffset = 100;
        const slideDirection = {
          up: { y: slideOffset },
          down: { y: -slideOffset },
          left: { x: slideOffset },
          right: { x: -slideOffset },
        };
        return {
          hidden: {
            ...slideDirection[direction],
            opacity: 0,
          },
          visible: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1],
            },
          },
          exit: {
            ...slideDirection[direction],
            opacity: 0,
            transition: {
              duration: duration * 0.5,
            },
          },
        };

      case 'scale':
        return {
          hidden: {
            scale: 0,
            opacity: 0,
          },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: [0.175, 0.885, 0.32, 1.275],
            },
          },
          exit: {
            scale: 0,
            opacity: 0,
          },
        };

      case 'rotate':
        return {
          hidden: {
            rotate: -180,
            scale: 0,
            opacity: 0,
          },
          visible: {
            rotate: 0,
            scale: 1,
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: 'easeOut',
            },
          },
          exit: {
            rotate: 180,
            scale: 0,
            opacity: 0,
          },
        };

      case 'blur':
        return {
          hidden: {
            filter: 'blur(20px)',
            opacity: 0,
          },
          visible: {
            filter: 'blur(0px)',
            opacity: 1,
            transition: {
              duration,
              delay,
            },
          },
          exit: {
            filter: 'blur(20px)',
            opacity: 0,
          },
        };

      case 'clip':
        const clipDirection = {
          up: 'inset(100% 0 0 0)',
          down: 'inset(0 0 100% 0)',
          left: 'inset(0 100% 0 0)',
          right: 'inset(0 0 0 100%)',
        };
        return {
          hidden: {
            clipPath: clipDirection[direction],
          },
          visible: {
            clipPath: 'inset(0 0 0 0)',
            transition: {
              duration,
              delay,
              ease: [0.77, 0, 0.175, 1],
            },
          },
          exit: {
            clipPath: clipDirection[direction],
          },
        };

      case 'mask':
        return {
          hidden: {
            clipPath: 'circle(0% at 50% 50%)',
          },
          visible: {
            clipPath: 'circle(150% at 50% 50%)',
            transition: {
              duration: duration * 1.5,
              delay,
              ease: 'easeInOut',
            },
          },
          exit: {
            clipPath: 'circle(0% at 50% 50%)',
          },
        };

      default: // fade
        return {
          hidden: {
            opacity: 0,
          },
          visible: {
            opacity: 1,
            transition: {
              duration,
              delay,
            },
          },
          exit: {
            opacity: 0,
          },
        };
    }
  };

  const variants = getVariants();

  // Render custom GSAP-based transitions
  if (variant === 'morph') {
    return (
      <div ref={containerRef} className={cn('relative', className)}>
        <svg
          className="absolute inset-0 w-full h-full z-50 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {[...Array(5)].map((_, i) => (
            <path
              key={i}
              ref={(el) => el && (morphPathsRef.current[i] = el)}
              className={backgroundColor}
              d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
            />
          ))}
        </svg>
        {children}
      </div>
    );
  }

  if (variant === 'split') {
    return (
      <div ref={containerRef} className={cn('relative', className)}>
        <div className="absolute inset-0 z-50 pointer-events-none flex">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn('split-panel flex-1 origin-bottom', backgroundColor)}
            />
          ))}
        </div>
        {children}
      </div>
    );
  }

  if (variant === 'curtain') {
    return (
      <div ref={containerRef} className={cn('relative', className)}>
        <div className="absolute inset-0 z-50 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'curtain-panel absolute inset-0',
                backgroundColor,
                i === 1 && 'delay-75',
                i === 2 && 'delay-150'
              )}
            />
          ))}
        </div>
        {children}
      </div>
    );
  }

  // Default Framer Motion transitions
  return (
    <AnimatePresence mode="wait">
      {isRevealed && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          onAnimationComplete={onComplete}
          className={cn('relative', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}