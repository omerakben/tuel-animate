import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { useGsapContext } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';

export interface HeroSectionProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundColor?: string;
  className?: string;
  children?: ReactNode;
  variant?: 'fade' | 'slide' | 'zoom' | 'parallax' | 'split' | 'curtain';
  height?: 'full' | 'screen' | 'large' | 'medium' | string;
  overlay?: boolean;
  overlayOpacity?: number;
  scrollIndicator?: boolean;
  onScrollComplete?: () => void;
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  backgroundVideo,
  backgroundColor = 'bg-black',
  className,
  children,
  variant = 'fade',
  height = 'screen',
  overlay = true,
  overlayOpacity = 0.5,
  scrollIndicator = true,
  onScrollComplete,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Height classes
  const getHeightClass = () => {
    switch (height) {
      case 'full':
        return 'h-full';
      case 'screen':
        return 'h-screen';
      case 'large':
        return 'h-[80vh]';
      case 'medium':
        return 'h-[60vh]';
      default:
        return height;
    }
  };

  // Animation variants
  const getVariants = (): Variants => {
    switch (variant) {
      case 'slide':
        return {
          hidden: { opacity: 0, y: 100 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 1,
              ease: 'easeOut',
              staggerChildren: 0.2,
            },
          },
        };
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 1.5 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: 1.5,
              ease: 'easeOut',
            },
          },
        };
      case 'split':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.5,
              staggerChildren: 0.1,
            },
          },
        };
      case 'curtain':
        return {
          hidden: { clipPath: 'inset(0 0 100% 0)' },
          visible: {
            clipPath: 'inset(0 0 0% 0)',
            transition: {
              duration: 1.5,
              ease: [0.77, 0, 0.175, 1],
            },
          },
        };
      default: // fade
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 1,
              ease: 'easeOut',
            },
          },
        };
    }
  };

  // GSAP animations for complex effects
  useGsapContext((ctx) => {
    if (!isClient || variant !== 'split') return;

    const title = contentRef.current?.querySelector('.hero-title');
    const subtitle = contentRef.current?.querySelector('.hero-subtitle');

    if (title) {
      gsap.from(title, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      });
    }

    if (subtitle) {
      gsap.from(subtitle, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4,
      });
    }
  }, [variant]);

  const variants = getVariants();
  const heightClass = getHeightClass();

  return (
    <motion.section
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={variants}
      className={cn(
        'relative overflow-hidden',
        heightClass,
        backgroundColor,
        className
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <motion.div
          style={variant === 'parallax' ? { y, scale } : {}}
          className="absolute inset-0 z-0"
        >
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Background Video */}
      {backgroundVideo && (
        <motion.div
          style={variant === 'parallax' ? { y, scale } : {}}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        </motion.div>
      )}

      {/* Overlay */}
      {overlay && (backgroundImage || backgroundVideo) && (
        <div
          className="absolute inset-0 z-10 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <motion.div
        ref={contentRef}
        style={variant === 'parallax' ? { opacity } : {}}
        className="relative z-20 h-full flex items-center justify-center px-4"
      >
        <div className="text-center max-w-6xl mx-auto">
          {title && (
            <motion.h1
              className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              variants={
                variant === 'split'
                  ? {
                      hidden: { y: 100, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }
                  : {}
              }
            >
              {title}
            </motion.h1>
          )}
          
          {subtitle && (
            <motion.p
              className="hero-subtitle text-lg md:text-xl lg:text-2xl opacity-90"
              variants={
                variant === 'split'
                  ? {
                      hidden: { y: 50, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }
                  : {}
              }
            >
              {subtitle}
            </motion.p>
          )}

          {children && (
            <motion.div
              className="mt-8"
              variants={
                variant === 'split'
                  ? {
                      hidden: { y: 30, opacity: 0 },
                      visible: { y: 0, opacity: 1 },
                    }
                  : {}
              }
            >
              {children}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      {scrollIndicator && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}