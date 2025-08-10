import { useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGsapContext } from '@tuel/gsap';
import { cn, isClient } from '@tuel/utils';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
  layout?: 'grid' | 'masonry' | 'carousel' | 'stack';
  columns?: number;
  gap?: number;
  animationType?: 'fade' | 'slide' | 'scale' | 'flip';
  hoverEffect?: 'zoom' | 'tilt' | 'overlay' | 'parallax';
  onClick?: (image: GalleryImage, index: number) => void;
}

export function ImageGallery({
  images,
  className,
  layout = 'grid',
  columns = 3,
  gap = 16,
  animationType = 'fade',
  hoverEffect = 'zoom',
  onClick,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  // Animation variants
  const getAnimationVariants = () => {
    switch (animationType) {
      case 'slide':
        return {
          hidden: { x: -100, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 },
        };
      case 'scale':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        };
      case 'flip':
        return {
          hidden: { rotateY: 90, opacity: 0 },
          visible: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };

  // Hover effect handlers
  const handleMouseEnter = (index: number) => {
    if (!isClient) return;
    const item = itemsRef.current[index];
    if (!item) return;

    switch (hoverEffect) {
      case 'zoom':
        gsap.to(item.querySelector('img'), {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out',
        });
        break;
      case 'tilt':
        gsap.to(item, {
          rotationY: 5,
          rotationX: 5,
          duration: 0.3,
          ease: 'power2.out',
        });
        break;
      case 'parallax':
        gsap.to(item.querySelector('img'), {
          y: -10,
          duration: 0.3,
          ease: 'power2.out',
        });
        break;
    }
  };

  const handleMouseLeave = (index: number) => {
    if (!isClient) return;
    const item = itemsRef.current[index];
    if (!item) return;

    gsap.to(item.querySelector('img'), {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
    
    gsap.to(item, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  // Layout styles
  const getLayoutStyles = () => {
    switch (layout) {
      case 'masonry':
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
          gridAutoRows: '10px',
        };
      case 'carousel':
        return {
          display: 'flex',
          gap: `${gap}px`,
          overflowX: 'auto',
        };
      case 'stack':
        return {
          position: 'relative' as const,
        };
      default:
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`,
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <>
      <div
        ref={galleryRef}
        className={cn('relative', className)}
        style={getLayoutStyles()}
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'relative overflow-hidden cursor-pointer',
              'transform-gpu will-change-transform',
              layout === 'stack' && 'absolute inset-0'
            )}
            style={layout === 'stack' ? { zIndex: images.length - index } : {}}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => {
              setSelectedImage(image);
              onClick?.(image, index);
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {hoverEffect === 'overlay' && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 hover:opacity-100 transition-opacity p-4">
                  {image.title && <h3 className="text-xl font-bold mb-2">{image.title}</h3>}
                  {image.description && <p>{image.description}</p>}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-8"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}