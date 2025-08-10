import { cn } from '@tuel/utils';
import { useEffect, useRef, useState } from 'react';

export interface ScrollMinimapProps {
  className?: string;
  position?: 'left' | 'right';
  width?: number;
  height?: number;
  backgroundColor?: string;
  trackColor?: string;
  thumbColor?: string;
  activeColor?: string;
  sections?: Array<{
    id: string;
    label?: string;
    color?: string;
  }>;
  showLabels?: boolean;
  autoHide?: boolean;
  hideDelay?: number;
}

export function ScrollMinimap({
  className,
  position = 'right',
  width = 100,
  height = 200,
  backgroundColor = 'rgba(0, 0, 0, 0.1)',
  trackColor = 'rgba(255, 255, 255, 0.1)',
  thumbColor = 'rgba(255, 255, 255, 0.5)',
  activeColor = '#3b82f6',
  sections = [],
  showLabels = true,
  autoHide = true,
  hideDelay = 1000,
}: ScrollMinimapProps) {
  const minimapRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(!autoHide);
  const [activeSectionIndex, setActiveSectionIndex] = useState(-1);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateMinimap = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      setDocumentHeight(docHeight);
      setViewportHeight(winHeight);
      setScrollProgress(scrollTop / (docHeight - winHeight));

      // Find active section
      if (sections.length > 0) {
        let activeIndex = -1;
        sections.forEach((section, index) => {
          const element = document.getElementById(section.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= winHeight / 2 && rect.bottom >= winHeight / 2) {
              activeIndex = index;
            }
          }
        });
        setActiveSectionIndex(activeIndex);
      }

      // Show minimap on scroll
      if (autoHide) {
        setIsVisible(true);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, hideDelay);
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(updateMinimap);
    };

    const handleResize = () => {
      updateMinimap();
    };

    updateMinimap();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [sections, autoHide, hideDelay]);

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = minimapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickY = e.clientY - rect.top;
    const clickRatio = clickY / rect.height;
    const scrollTo = clickRatio * (documentHeight - viewportHeight);

    window.scrollTo({
      top: scrollTo,
      behavior: 'smooth',
    });
  };

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const thumbHeight = (viewportHeight / documentHeight) * height;
  const thumbTop = scrollProgress * (height - thumbHeight);

  return (
    <div
      className={cn(
        'fixed z-50 transition-opacity duration-300',
        position === 'right' ? 'right-4' : 'left-4',
        'top-1/2 -translate-y-1/2',
        !isVisible && 'opacity-0 pointer-events-none',
        className
      )}
      style={{ width }}
    >
      {/* Minimap Track */}
      <div
        ref={minimapRef}
        className="relative cursor-pointer rounded-lg overflow-hidden"
        style={{
          height,
          backgroundColor,
        }}
        onClick={handleMinimapClick}
      >
        {/* Sections */}
        {sections.map((section, index) => {
          const element = document.getElementById(section.id);
          if (!element) return null;

          const elementTop = element.offsetTop;
          const elementHeight = element.offsetHeight;
          const sectionTop = (elementTop / documentHeight) * height;
          const sectionHeight = (elementHeight / documentHeight) * height;

          return (
            <div
              key={section.id}
              className="absolute left-0 right-0 transition-colors duration-200"
              style={{
                top: sectionTop,
                height: sectionHeight,
                backgroundColor:
                  activeSectionIndex === index ? activeColor : section.color || trackColor,
                opacity: activeSectionIndex === index ? 0.3 : 0.1,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSectionClick(section.id);
              }}
            />
          );
        })}

        {/* Viewport Thumb */}
        <div
          className="absolute left-0 right-0 rounded transition-all duration-200"
          style={{
            top: thumbTop,
            height: thumbHeight,
            backgroundColor: thumbColor,
          }}
        />

        {/* Section Labels */}
        {showLabels &&
          sections.map((section, index) => {
            const element = document.getElementById(section.id);
            if (!element || !section.label) return null;

            const elementTop = element.offsetTop;
            const sectionTop = (elementTop / documentHeight) * height;

            return (
              <div
                key={`${section.id}-label`}
                className={cn(
                  'absolute text-xs whitespace-nowrap transition-all duration-200',
                  position === 'right' ? 'right-full mr-2' : 'left-full ml-2',
                  activeSectionIndex === index ? 'opacity-100 font-bold' : 'opacity-50'
                )}
                style={{
                  top: sectionTop,
                  color: activeSectionIndex === index ? activeColor : 'inherit',
                }}
              >
                {section.label}
              </div>
            );
          })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-2 text-xs text-center opacity-50">{Math.round(scrollProgress * 100)}%</div>
    </div>
  );
}
