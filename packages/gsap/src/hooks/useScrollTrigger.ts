import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isClient } from '@tuel/utils';

if (isClient) {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollTriggerOptions {
  trigger?: string | Element;
  start?: string | number;
  end?: string | number;
  scrub?: boolean | number;
  pin?: boolean | string | Element;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  onUpdate?: (self: ScrollTrigger) => void;
}

export function useScrollTrigger(
  animation: gsap.core.Animation | null,
  options: ScrollTriggerOptions = {}
) {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!animation || !isClient) return;

    triggerRef.current = ScrollTrigger.create({
      animation,
      ...options,
    });

    return () => {
      triggerRef.current?.kill();
    };
  }, [animation]);

  return triggerRef.current;
}
