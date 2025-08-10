import { useRef, MutableRefObject } from 'react';
import { gsap } from 'gsap';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

type GsapContextCallback = (context: gsap.Context) => void | (() => void);

export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  callback: GsapContextCallback,
  dependencies: any[] = []
): MutableRefObject<T | null> {
  const ref = useRef<T>(null);
  
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    
    const ctx = gsap.context(() => {}, ref);
    const cleanup = callback(ctx);
    
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
      ctx.revert();
    };
  }, dependencies);
  
  return ref;
}