import { useRef, useEffect, ReactNode } from 'react';
import { motion, Variants, useInView } from 'motion/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGsapContext, useIsomorphicLayoutEffect } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';

if (isClient) {
  gsap.registerPlugin(SplitText);
}

export interface AnimatedTextProps {
  children: string;
  className?: string;
  variant?: 'fade' | 'slide' | 'typewriter' | 'scramble' | 'split' | 'explode' | 'wave';
  splitType?: 'chars' | 'words' | 'lines';
  staggerDelay?: number;
  duration?: number;
  triggerOnScroll?: boolean;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}

export function AnimatedText({
  children,
  className,
  variant = 'fade',
  splitType = 'chars',
  staggerDelay = 0.03,
  duration = 0.5,
  triggerOnScroll = true,
  delay = 0,
  as: Component = 'div',
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const splitRef = useRef<SplitText | null>(null);
  const isInView = useInView(textRef, { once: true, amount: 0.5 });

  // Framer Motion variants
  const getVariants = (): Variants => {
    switch (variant) {
      case 'slide':
        return {
          hidden: { 
            opacity: 0, 
            y: 50,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
              staggerChildren: staggerDelay,
            },
          },
        };
      case 'typewriter':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.05,
              delay,
              staggerChildren: 0.05,
            },
          },
        };
      case 'wave':
        return {
          hidden: { 
            opacity: 0,
            y: 100,
            rotateZ: -10,
          },
          visible: {
            opacity: 1,
            y: 0,
            rotateZ: 0,
            transition: {
              duration,
              delay,
              staggerChildren: staggerDelay,
              ease: [0.6, 0.01, -0.05, 0.95],
            },
          },
        };
      default: // fade
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
              delay,
              staggerChildren: staggerDelay,
            },
          },
        };
    }
  };

  // GSAP animations for more complex effects
  useGsapContext((ctx) => {
    if (!isClient || !textRef.current) return;
    
    if (variant === 'split' || variant === 'explode' || variant === 'scramble') {
      // Create SplitText instance
      splitRef.current = new SplitText(textRef.current, { 
        type: splitType,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      });

      const elements = splitRef.current[splitType];
      
      if (variant === 'split') {
        gsap.set(elements, { opacity: 0, y: 50, rotateX: -90 });
        
        const tl = gsap.timeline({
          delay,
          onComplete: () => {
            if (splitRef.current) {
              splitRef.current.revert();
            }
          },
        });

        tl.to(elements, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration,
          stagger: staggerDelay,
          ease: 'back.out(1.7)',
        });

        if (triggerOnScroll && !isInView) {
          tl.pause();
        }
      } else if (variant === 'explode') {
        gsap.set(elements, { opacity: 0, scale: 0 });
        
        const tl = gsap.timeline({ delay });
        
        tl.to(elements, {
          opacity: 1,
          scale: 1,
          duration,
          stagger: {
            amount: 0.5,
            from: 'center',
            grid: 'auto',
          },
          ease: 'elastic.out(1, 0.5)',
        });

        if (triggerOnScroll && !isInView) {
          tl.pause();
        }
      } else if (variant === 'scramble') {
        const originalText = children;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        
        elements.forEach((el: HTMLElement, i: number) => {
          const originalChar = el.textContent || '';
          let scrambleCount = 0;
          const maxScrambles = 10;
          
          const scrambleInterval = setInterval(() => {
            if (scrambleCount < maxScrambles) {
              el.textContent = chars[Math.floor(Math.random() * chars.length)];
              scrambleCount++;
            } else {
              el.textContent = originalChar;
              clearInterval(scrambleInterval);
            }
          }, 50);
        });
      }
    }

    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
      }
    };
  }, [variant, splitType, duration, staggerDelay, delay, isInView, triggerOnScroll]);

  // Trigger animation on scroll
  useEffect(() => {
    if (triggerOnScroll && isInView && splitRef.current) {
      const tl = gsap.timeline();
      const elements = splitRef.current[splitType];
      
      if (variant === 'split' || variant === 'explode') {
        tl.play();
      }
    }
  }, [isInView, triggerOnScroll, variant, splitType]);

  // For Framer Motion variants
  if (variant === 'fade' || variant === 'slide' || variant === 'typewriter' || variant === 'wave') {
    const variants = getVariants();
    
    return (
      <motion.div
        ref={textRef as any}
        initial="hidden"
        animate={triggerOnScroll ? (isInView ? 'visible' : 'hidden') : 'visible'}
        variants={variants}
        className={cn('overflow-hidden', className)}
      >
        {variant === 'typewriter' ? (
          children.split('').map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))
        ) : (
          <Component>{children}</Component>
        )}
      </motion.div>
    );
  }

  // For GSAP animations
  return (
    <Component 
      ref={textRef as any}
      className={cn('overflow-hidden', className)}
    >
      {children}
    </Component>
  );
}