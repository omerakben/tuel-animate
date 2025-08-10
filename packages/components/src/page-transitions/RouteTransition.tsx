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
  // Suppress unused variable warnings for props that will be used when re-enabled
  void variant;
  void duration;
  void backgroundColor;

  return (
    <DisabledComponentPlaceholder
      name="RouteTransition"
      description="Next.js App Router compatibility - needs migration from pages router events"
      className="min-h-[200px]"
    >
      {children}
    </DisabledComponentPlaceholder>
  );
}
