import { cn } from '@tuel/utils';
import { ReactNode, useEffect, useRef } from 'react';

export interface ViewTransitionProps {
  children: ReactNode;
  className?: string;
  name?: string;
  enabled?: boolean;
  fallbackAnimation?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
}

export function ViewTransition({
  children,
  className,
  name,
  enabled = true,
  fallbackAnimation = 'fade',
  duration = 300,
}: ViewTransitionProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    // Set view-transition-name if supported
    if ('viewTransitionName' in document.documentElement.style) {
      element.style.viewTransitionName = name || 'auto';
    } else {
      // Fallback for browsers that don't support View Transition API
      element.style.transition = `all ${duration}ms ease-in-out`;

      switch (fallbackAnimation) {
        case 'fade':
          element.style.opacity = '0';
          requestAnimationFrame(() => {
            element.style.opacity = '1';
          });
          break;
        case 'slide':
          element.style.transform = 'translateX(-100%)';
          requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
          });
          break;
        case 'scale':
          element.style.transform = 'scale(0.8)';
          element.style.opacity = '0';
          requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
          });
          break;
        default:
          break;
      }
    }
  }, [enabled, name, fallbackAnimation, duration]);

  return (
    <div
      ref={elementRef}
      className={cn('view-transition', className)}
      data-view-transition-name={name}
    >
      {children}
    </div>
  );
}

// Hook for programmatic view transitions
export function useViewTransition() {
  const startTransition = async (callback: () => void | Promise<void>) => {
    if ('startViewTransition' in document) {
      // Use native View Transition API
      (document as any).startViewTransition(callback);
    } else {
      // Fallback: just execute the callback
      await callback();
    }
  };

  return { startTransition };
}

// Higher-order component for automatic page transitions
export interface ViewPageTransitionProps {
  children: ReactNode;
  className?: string;
  transitionName?: string;
  enabled?: boolean;
}

export function ViewPageTransition({
  children,
  className,
  transitionName = 'page',
  enabled = true,
}: ViewPageTransitionProps) {
  return (
    <ViewTransition
      className={cn('min-h-screen', className)}
      name={transitionName}
      enabled={enabled}
      fallbackAnimation="fade"
      duration={400}
    >
      {children}
    </ViewTransition>
  );
}
