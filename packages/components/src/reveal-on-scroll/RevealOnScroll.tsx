import { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, Variants, useInView, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapContext } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';
import { fadeInUpVariants } from '@tuel/motion';

if (isClient) {
  gsap.registerPlugin(ScrollTrigger);
}

export interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  engine?: 'framer' | 'gsap';
  variants?: Variants;
  onReveal?: () => void;
  disabled?: boolean;
}

export function RevealOnScroll({
  children,
  className,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  delay = 0,
  duration = 0.6,
  distance = 30,
  direction = 'up',
  engine = 'framer',
  variants = fadeInUpVariants,
  onReveal,
  disabled = false,
}: RevealOnScrollProps) {
  const [hasRevealed, setHasRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(elementRef, {
    amount: threshold,
    margin: rootMargin as any,
    once: triggerOnce,
  });

  // Framer Motion approach
  useEffect(() => {
    if (engine !== 'framer' || disabled) return;
    
    if (inView && (!triggerOnce || !hasRevealed)) {
      controls.start('visible');
      setHasRevealed(true);
      onReveal?.();
    } else if (!inView && !triggerOnce) {
      controls.start('hidden');
    }
  }, [inView, controls, hasRevealed, triggerOnce, onReveal, disabled, engine]);

  // GSAP approach
  const gsapRef = useGsapContext<HTMLDivElement>(() => {
    if (engine !== 'gsap' || disabled || !isClient) return;

    const getInitialTransform = () => {
      switch (direction) {
        case 'up': return { y: distance, opacity: 0 };
        case 'down': return { y: -distance, opacity: 0 };
        case 'left': return { x: distance, opacity: 0 };
        case 'right': return { x: -distance, opacity: 0 };
      }
    };

    gsap.set(gsapRef.current, getInitialTransform());

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gsapRef.current,
        start: `top bottom-=${100 * threshold}`,
        end: 'bottom top',
        once: triggerOnce,
        onEnter: () => {
          gsap.to(gsapRef.current, {
            opacity: 1,
            x: 0,
            y: 0,
            duration,
            delay,
            ease: 'power2.out',
            onComplete: () => {
              setHasRevealed(true);
              onReveal?.();
            },
          });
        },
        onLeaveBack: !triggerOnce ? () => {
          gsap.to(gsapRef.current, {
            ...getInitialTransform(),
            duration: duration * 0.5,
            ease: 'power2.in',
          });
        } : undefined,
      },
    });

    return () => {
      tl.kill();
    };
  }, [direction, distance, duration, delay, threshold, triggerOnce, onReveal, disabled, engine]);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  if (engine === 'gsap') {
    return (
      <div ref={gsapRef} className={cn('will-change-transform', className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={elementRef}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={cn('will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
}