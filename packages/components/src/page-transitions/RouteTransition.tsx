import { ReactNode, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { gsap } from 'gsap';
import { useGsapContext } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';

export interface RouteTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'push' | 'reveal' | 'distort';
  duration?: number;
  backgroundColor?: string;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

export function RouteTransition({
  children,
  className,
  variant = 'fade',
  duration = 0.6,
  backgroundColor = 'bg-black',
  onTransitionStart,
  onTransitionEnd,
}: RouteTransitionProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  useGsapContext((ctx) => {
    if (!isClient || !containerRef.current) return;

    const handleRouteChangeStart = () => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      onTransitionStart?.();

      const overlay = overlayRef.current;
      const content = contentRef.current;
      if (!overlay || !content) return;

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false;
        },
      });

      switch (variant) {
        case 'slide':
          tl.fromTo(
            overlay,
            {
              xPercent: -100,
            },
            {
              xPercent: 0,
              duration: duration * 0.5,
              ease: 'power3.inOut',
            }
          );
          break;

        case 'push':
          tl.to(content, {
            xPercent: 100,
            duration: duration * 0.5,
            ease: 'power3.inOut',
          }).fromTo(
            overlay,
            {
              xPercent: -100,
            },
            {
              xPercent: 0,
              duration: duration * 0.5,
              ease: 'power3.inOut',
            },
            0
          );
          break;

        case 'reveal':
          tl.set(overlay, {
            transformOrigin: 'center center',
          }).fromTo(
            overlay,
            {
              scale: 0,
              borderRadius: '100%',
            },
            {
              scale: 2,
              borderRadius: '0%',
              duration,
              ease: 'power4.inOut',
            }
          );
          break;

        case 'distort':
          tl.to(content, {
            scale: 0.9,
            filter: 'blur(10px)',
            duration: duration * 0.3,
            ease: 'power2.in',
          }).fromTo(
            overlay,
            {
              clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
            },
            {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              duration: duration * 0.7,
              ease: 'power4.inOut',
            },
            `-=${duration * 0.1}`
          );
          break;

        default: // fade
          tl.fromTo(
            overlay,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: duration * 0.5,
              ease: 'power2.inOut',
            }
          );
      }
    };

    const handleRouteChangeComplete = () => {
      const overlay = overlayRef.current;
      const content = contentRef.current;
      if (!overlay || !content) return;

      const tl = gsap.timeline({
        onComplete: () => {
          onTransitionEnd?.();
        },
      });

      switch (variant) {
        case 'slide':
          tl.to(overlay, {
            xPercent: 100,
            duration: duration * 0.5,
            ease: 'power3.inOut',
          });
          break;

        case 'push':
          tl.set(content, {
            xPercent: -100,
          })
            .to(content, {
              xPercent: 0,
              duration: duration * 0.5,
              ease: 'power3.inOut',
            })
            .to(
              overlay,
              {
                xPercent: 100,
                duration: duration * 0.5,
                ease: 'power3.inOut',
              },
              0
            );
          break;

        case 'reveal':
          tl.to(overlay, {
            scale: 0,
            borderRadius: '100%',
            duration,
            ease: 'power4.inOut',
          });
          break;

        case 'distort':
          tl.to(overlay, {
            clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            duration: duration * 0.7,
            ease: 'power4.inOut',
          }).to(
            content,
            {
              scale: 1,
              filter: 'blur(0px)',
              duration: duration * 0.3,
              ease: 'power2.out',
            },
            `-=${duration * 0.1}`
          );
          break;

        default: // fade
          tl.to(overlay, {
            opacity: 0,
            duration: duration * 0.5,
            ease: 'power2.inOut',
          });
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router, variant, duration]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
      <div
        ref={overlayRef}
        className={cn(
          'fixed inset-0 z-50 pointer-events-none',
          backgroundColor,
          variant === 'slide' && 'transform -translate-x-full',
          variant === 'reveal' && 'transform scale-0',
          variant === 'fade' && 'opacity-0'
        )}
      />
    </div>
  );
}

// View Transition API wrapper for modern browsers
export interface ViewTransitionProps {
  children: ReactNode;
  className?: string;
  name?: string;
  duration?: number;
}

export function ViewTransition({
  children,
  className,
  name = 'page',
  duration = 500,
}: ViewTransitionProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClient || !('startViewTransition' in document)) return;

    const handleRouteChange = async (url: string) => {
      // @ts-ignore - View Transitions API
      const transition = document.startViewTransition(async () => {
        await router.push(url);
      });

      try {
        await transition.finished;
      } catch (error) {
        console.error('View transition failed:', error);
      }
    };

    // Override router push to use View Transitions API
    const originalPush = router.push;
    router.push = (url: any, as?: any, options?: any) => {
      if (typeof url === 'string' && 'startViewTransition' in document) {
        handleRouteChange(url);
        return Promise.resolve(true);
      }
      return originalPush(url, as, options);
    };

    return () => {
      router.push = originalPush;
    };
  }, [router]);

  return (
    <div
      ref={containerRef}
      className={cn('view-transition', className)}
      style={{
        // @ts-ignore - CSS property for View Transitions API
        viewTransitionName: name,
        // @ts-ignore
        '--transition-duration': `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}