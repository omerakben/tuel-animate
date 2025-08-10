import { Variants } from 'framer-motion';
import { animations } from '@tuel/tokens';

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.easeOut,
    },
  },
};