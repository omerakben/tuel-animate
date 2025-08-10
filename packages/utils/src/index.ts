import { breakpoints } from '@tuel/tokens';

export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const isTouchDevice = () => {
  if (isServer) return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getBreakpoint = () => {
  if (isServer) return 'lg';
  const width = window.innerWidth;
  
  if (width < breakpoints.sm) return 'xs';
  if (width < breakpoints.md) return 'sm';
  if (width < breakpoints.lg) return 'md';
  if (width < breakpoints.xl) return 'lg';
  if (width < breakpoints['2xl']) return 'xl';
  return '2xl';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};