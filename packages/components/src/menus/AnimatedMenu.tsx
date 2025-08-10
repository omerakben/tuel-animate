import { useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { useGsapContext } from '@tuel/gsap';
import { cn } from '@tuel/utils';

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  subItems?: MenuItem[];
}

export interface AnimatedMenuProps {
  items: MenuItem[];
  className?: string;
  variant?: 'slide' | 'overlay' | 'push' | 'morph' | 'circular';
  position?: 'left' | 'right' | 'top' | 'bottom';
  triggerElement?: ReactNode;
  backgroundColor?: string;
  textColor?: string;
  animationDuration?: number;
  staggerDelay?: number;
}

export function AnimatedMenu({
  items,
  className,
  variant = 'slide',
  position = 'left',
  triggerElement,
  backgroundColor = 'bg-black',
  textColor = 'text-white',
  animationDuration = 0.5,
  staggerDelay = 0.1,
}: AnimatedMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  // Menu variants
  const getMenuVariants = (): Variants => {
    switch (variant) {
      case 'overlay':
        return {
          hidden: { 
            clipPath: 'circle(0% at 50% 50%)',
            opacity: 0,
          },
          visible: { 
            clipPath: 'circle(150% at 50% 50%)',
            opacity: 1,
            transition: { duration: animationDuration, ease: 'easeInOut' },
          },
          exit: { 
            clipPath: 'circle(0% at 50% 50%)',
            opacity: 0,
            transition: { duration: animationDuration, ease: 'easeInOut' },
          },
        };
      case 'push':
        const pushDirection = {
          left: { x: '-100%' },
          right: { x: '100%' },
          top: { y: '-100%' },
          bottom: { y: '100%' },
        };
        return {
          hidden: pushDirection[position],
          visible: { 
            x: 0, 
            y: 0,
            transition: { duration: animationDuration, ease: 'easeOut' },
          },
          exit: {
            ...pushDirection[position],
            transition: { duration: animationDuration, ease: 'easeIn' },
          },
        };
      case 'morph':
        return {
          hidden: { 
            scale: 0,
            borderRadius: '50%',
          },
          visible: { 
            scale: 1,
            borderRadius: '0%',
            transition: { duration: animationDuration, ease: 'easeOut' },
          },
          exit: { 
            scale: 0,
            borderRadius: '50%',
            transition: { duration: animationDuration, ease: 'easeIn' },
          },
        };
      case 'circular':
        return {
          hidden: { 
            clipPath: `circle(0% at ${position === 'right' ? '100% 0%' : '0% 0%'})`,
          },
          visible: { 
            clipPath: 'circle(150% at 50% 50%)',
            transition: { duration: animationDuration, ease: 'easeOut' },
          },
          exit: { 
            clipPath: `circle(0% at ${position === 'right' ? '100% 0%' : '0% 0%'})`,
            transition: { duration: animationDuration, ease: 'easeIn' },
          },
        };
      default: // slide
        const slideDirection = {
          left: { x: '-100%' },
          right: { x: '100%' },
          top: { y: '-100%' },
          bottom: { y: '100%' },
        };
        return {
          hidden: slideDirection[position],
          visible: { 
            x: 0, 
            y: 0,
            transition: { duration: animationDuration, type: 'spring', damping: 20 },
          },
          exit: {
            ...slideDirection[position],
            transition: { duration: animationDuration / 2 },
          },
        };
    }
  };

  // Item variants
  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: position === 'left' ? -50 : position === 'right' ? 50 : 0,
      y: position === 'top' ? -50 : position === 'bottom' ? 50 : 0,
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: i * staggerDelay,
        duration: 0.3,
        ease: 'easeOut',
      },
    }),
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // Position styles
  const getPositionStyles = () => {
    const base = 'fixed z-50';
    switch (position) {
      case 'right':
        return `${base} top-0 right-0 h-full w-80`;
      case 'top':
        return `${base} top-0 left-0 w-full h-80`;
      case 'bottom':
        return `${base} bottom-0 left-0 w-full h-80`;
      default: // left
        return `${base} top-0 left-0 h-full w-80`;
    }
  };

  const menuVariants = getMenuVariants();

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50"
        aria-label="Toggle menu"
      >
        {triggerElement || (
          <div className="space-y-1.5 p-2">
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
              className="block h-0.5 w-8 bg-current"
            />
            <motion.span
              animate={{ opacity: isOpen ? 0 : 1 }}
              className="block h-0.5 w-8 bg-current"
            />
            <motion.span
              animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
              className="block h-0.5 w-8 bg-current"
            />
          </div>
        )}
      </button>

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Menu Content */}
            <motion.nav
              ref={menuRef}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className={cn(
                getPositionStyles(),
                backgroundColor,
                textColor,
                'overflow-hidden',
                className
              )}
            >
              <div className="h-full overflow-y-auto p-8">
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      ref={(el) => {
                        if (el) itemsRef.current[index] = el;
                      }}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <a
                        href={item.href || '#'}
                        className="block text-2xl font-bold hover:opacity-70 transition-opacity"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="flex items-center gap-4">
                          {item.icon}
                          {item.label}
                        </span>
                      </a>
                      
                      {/* Sub-items */}
                      {item.subItems && (
                        <div className="ml-8 mt-2 space-y-2">
                          {item.subItems.map((subItem) => (
                            <a
                              key={subItem.id}
                              href={subItem.href || '#'}
                              className="block text-lg opacity-70 hover:opacity-100 transition-opacity"
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}