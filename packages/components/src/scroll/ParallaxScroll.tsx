import { cn } from '@tuel/utils';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

export interface ParallaxScrollProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  offset?: [string, string];
  direction?: 'vertical' | 'horizontal';
  fadeIn?: boolean;
  scaleOnScroll?: boolean;
  rotateOnScroll?: boolean;
}

export function ParallaxScroll({
  children,
  className,
  speed = 0.5,
  offset = ['start end', 'end start'],
  direction = 'vertical',
  fadeIn = false,
  scaleOnScroll = false,
  rotateOnScroll = false,
}: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Calculate parallax transforms
  const distance = 100 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const x = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  // Optional effects
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], fadeIn ? [0, 1, 0] : [1, 1, 1]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    scaleOnScroll ? [0.8, 1, 0.8] : [1, 1, 1]
  );
  const rotate = useTransform(scrollYProgress, [0, 1], rotateOnScroll ? [-5, 5] : [0, 0]);

  const transforms: { [key: string]: MotionValue<any> } = {
    opacity,
    scale,
    rotate,
  };

  if (direction === 'vertical') {
    transforms.y = y;
  } else {
    transforms.x = x;
  }

  return (
    <motion.div ref={ref} style={transforms} className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  );
}

// Multi-layer parallax container
export interface ParallaxLayerProps {
  children: ReactNode;
  speed: number;
  className?: string;
  offset?: [string, string] | number;
  direction?: 'vertical' | 'horizontal';
  fadeIn?: boolean;
  scaleOnScroll?: boolean;
  rotateOnScroll?: boolean;
}

export function ParallaxLayer({
  children,
  speed,
  className,
  offset,
  direction,
  fadeIn,
  scaleOnScroll,
  rotateOnScroll,
}: ParallaxLayerProps) {
  // Convert numeric offset to string tuple format
  const scrollOffset: [string, string] =
    typeof offset === 'number'
      ? [`${offset * 100}% end`, `${(offset + 1) * 100}% start`]
      : offset || ['start end', 'end start'];

  return (
    <ParallaxScroll
      speed={speed}
      className={className}
      offset={scrollOffset}
      direction={direction}
      fadeIn={fadeIn}
      scaleOnScroll={scaleOnScroll}
      rotateOnScroll={rotateOnScroll}
    >
      {children}
    </ParallaxScroll>
  );
}

export interface ParallaxContainerProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxContainer({ children, className }: ParallaxContainerProps) {
  return <div className={cn('relative overflow-hidden', className)}>{children}</div>;
}
