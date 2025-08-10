import { cn } from '@tuel/utils';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

export interface PageRevealProps {
  children: ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'rotate' | 'blur' | 'clip' | 'mask';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  stagger?: number;
  onComplete?: () => void;
  trigger?: boolean;
  backgroundColor?: string;
}

export function PageReveal({
  children,
  className,
  variant = 'fade',
  direction = 'up',
  duration = 1,
  delay = 0,
  stagger: _stagger = 0.1,
  onComplete,
  trigger = true,
  backgroundColor: _backgroundColor = 'bg-black',
}: PageRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsRevealed(true);
    }
  }, [trigger]);

  // Get animation variants
  const getVariants = (): Variants => {
    switch (variant) {
      case 'slide': {
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
      }

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

      case 'clip': {
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
      }

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

// Overlay reveal animation for page transitions
export interface OverlayRevealProps {
  isOpen: boolean;
  children: ReactNode;
  overlayColor?: string;
  duration?: number;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
}

export function OverlayReveal({
  isOpen,
  children,
  overlayColor = 'bg-black',
  duration = 0.6,
  direction = 'horizontal',
}: OverlayRevealProps) {
  const getOverlayVariants = (): Variants => {
    switch (direction) {
      case 'vertical':
        return {
          initial: { scaleY: 0 },
          animate: { scaleY: 1 },
          exit: { scaleY: 0 },
        };
      case 'diagonal':
        return {
          initial: { scale: 0, rotate: -45 },
          animate: { scale: 1.5, rotate: -45 },
          exit: { scale: 0, rotate: -45 },
        };
      default: // horizontal
        return {
          initial: { scaleX: 0 },
          animate: { scaleX: 1 },
          exit: { scaleX: 0 },
        };
    }
  };

  const overlayVariants = getOverlayVariants();

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className={cn('fixed inset-0 z-50', overlayColor)}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={overlayVariants}
            transition={{
              duration,
              ease: [0.77, 0, 0.175, 1],
            }}
            style={{
              transformOrigin: direction === 'diagonal' ? 'center' : undefined,
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
