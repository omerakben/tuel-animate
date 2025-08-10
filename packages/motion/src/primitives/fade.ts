import { Variants } from 'framer-motion';
import { animations } from '@tuel/tokens';

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: animations.duration.fast / 1000,
      ease: animations.easing.easeIn,
    },
  },
};

export const fadeInUpVariants: Variants = {
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

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animations.duration.normal / 1000,
      ease: animations.easing.easeOut,
    },
  },
};