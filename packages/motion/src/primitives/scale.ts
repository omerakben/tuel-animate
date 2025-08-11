import { Variants } from 'motion/react';
import { animations } from '@tuel/tokens';

export const scaleVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.motion.easeOut,
    },
  },
};

export const scaleInVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.motion.easeOut,
    },
  },
};

export const scaleOutVariants: Variants = {
  visible: { scale: 1, opacity: 1 },
  hidden: {
    scale: 1.2,
    opacity: 0,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.motion.easeIn,
    },
  },
};
