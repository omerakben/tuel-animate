import { Variants } from 'framer-motion';
import { animations } from '@tuel/tokens';

export const rotateVariants: Variants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.easeOut,
    },
  },
};

export const rotate3DVariants: Variants = {
  hidden: { 
    rotateX: -90,
    opacity: 0,
  },
  visible: {
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: animations.duration.slow / 1000,
      ease: animations.easing.easeOut,
    },
  },
};