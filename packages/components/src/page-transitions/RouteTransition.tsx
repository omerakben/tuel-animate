import { ReactNode } from 'react';
import { DisabledComponentPlaceholder } from '../DisabledComponents';

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
  variant = 'fade',
  duration = 0.6,
  backgroundColor = 'bg-black',
}: RouteTransitionProps) {
  return (
    <DisabledComponentPlaceholder
      componentName="RouteTransition"
      reason="Next.js App Router compatibility - needs migration from pages router events"
      estimatedTimeToReEnable="1-2 weeks"
      originalProps={{
        variant,
        duration,
        backgroundColor,
        onTransitionStart: 'function',
        onTransitionEnd: 'function',
      }}
    >
      {children}
    </DisabledComponentPlaceholder>
  );
}
