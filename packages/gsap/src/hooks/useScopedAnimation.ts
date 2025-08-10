import { useRef, useCallback } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

type GSAPTween = any; // Will be typed by consumer

export function useScopedAnimation<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const animationsRef = useRef<GSAPTween[]>([]);
  
  const addAnimation = useCallback((animation: GSAPTween) => {
    animationsRef.current.push(animation);
  }, []);
  
  const clearAnimations = useCallback(() => {
    animationsRef.current.forEach(animation => animation.kill());
    animationsRef.current = [];
  }, []);
  
  useIsomorphicLayoutEffect(() => {
    return () => {
      clearAnimations();
    };
  }, [clearAnimations]);
  
  return {
    ref,
    addAnimation,
    clearAnimations,
  };
}