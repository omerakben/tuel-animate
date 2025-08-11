import { Variants } from 'motion/react';
import { animations } from '@tuel/tokens';

export const slideInLeftVariants: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.motion.easeOut,
    },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.motion.easeOut,
    },
  },
};

export const slideInTopVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.motion.easeOut,
    },
  },
};

export const slideInBottomVariants: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.motion.easeOut,
    },
  },
};
