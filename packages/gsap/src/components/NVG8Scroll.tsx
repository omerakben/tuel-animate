'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';
import './NVG8Scroll.css';

gsap.registerPlugin(ScrollTrigger);

interface IconData {
  id: number;
  src: string;
  alt: string;
}

interface TextSegment {
  text: string;
  hasPlaceholder?: boolean;
}

interface NVG8ScrollProps {
  title?: string;
  subtitle?: string;
  icons?: IconData[];
  textSegments?: TextSegment[];
  outroTitle?: string;
  className?: string;
}

const defaultIcons: IconData[] = [
  { id: 1, src: '/icon_1.png', alt: 'Icon 1' },
  { id: 2, src: '/icon_2.png', alt: 'Icon 2' },
  { id: 3, src: '/icon_3.png', alt: 'Icon 3' },
  { id: 4, src: '/icon_4.png', alt: 'Icon 4' },
  { id: 5, src: '/icon_5.png', alt: 'Icon 5' },
];

const defaultTextSegments: TextSegment[] = [
  { text: 'Delve into coding', hasPlaceholder: true },
  { text: 'without clutter.' },
  { text: 'Unlock source code ', hasPlaceholder: true },
  { text: 'for every tutorial', hasPlaceholder: true },
  { text: 'published on the Codegrid', hasPlaceholder: true },
  { text: 'YouTube channel.' },
];

export const NVG8Scroll: React.FC<NVG8ScrollProps> = ({
  title = 'CodegridPRO',
  subtitle = 'One subscription, endless web design.',
  icons = defaultIcons,
  textSegments = defaultTextSegments,
  outroTitle = 'Link in description',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const animatedIconsRef = useRef<HTMLDivElement>(null);
  const animatedTextRef = useRef<HTMLDivElement>(null);
  const duplicateIconsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (
      !containerRef.current ||
      !heroRef.current ||
      !heroHeaderRef.current ||
      !animatedIconsRef.current ||
      !animatedTextRef.current
    )
      return;

    const container = containerRef.current;
    const heroSection = heroRef.current;
    const heroHeader = heroHeaderRef.current;
    const animatedIcons = animatedIconsRef.current;
    const animatedText = animatedTextRef.current;

    // Get elements
    const iconElements = Array.from(animatedIcons.children) as HTMLElement[];
    const placeholders = Array.from(
      animatedText.querySelectorAll('.placeholder-icon')
    ) as HTMLElement[];
    const textSegmentElements = Array.from(
      animatedText.querySelectorAll('.text-segment')
    ) as HTMLElement[];

    // Calculate responsive icon sizes
    const isMobile = window.innerWidth <= 1000;
    const headerIconSize = isMobile ? 30 : 60;

    // Calculate exact scale for centering
    const getExactScale = (): number => {
      const containerRect = animatedIcons.getBoundingClientRect();
      const availableWidth = window.innerWidth - 200;
      const availableHeight = window.innerHeight - 200;
      const scaleX = availableWidth / containerRect.width;
      const scaleY = availableHeight / containerRect.height;
      return Math.min(scaleX, scaleY, 3);
    };

    let exactScale = getExactScale();

    // Create randomized text animation order
    const textAnimationOrder: Array<{ segment: HTMLElement; index: number }> = [];
    textSegmentElements.forEach((segment, index) => {
      textAnimationOrder.push({ segment, index });
    });

    // Shuffle the animation order
    for (let i = textAnimationOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [textAnimationOrder[i], textAnimationOrder[j]] = [
        textAnimationOrder[j],
        textAnimationOrder[i],
      ];
    }

    // Cleanup function for duplicate icons
    const cleanupDuplicateIcons = () => {
      duplicateIconsRef.current.forEach((duplicate) => {
        if (duplicate.parentNode) {
          duplicate.parentNode.removeChild(duplicate);
        }
      });
      duplicateIconsRef.current = [];
    };

    // Update exact scale on resize
    const handleResize = () => {
      exactScale = getExactScale();
    };

    window.addEventListener('resize', handleResize);

    // Set initial states
    gsap.set(textSegmentElements, { opacity: 0 });
    gsap.set(animatedIcons, { opacity: 1 });

    // Create scroll animation
    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress <= 0.3) {
          // Phase 1: Icon movement up
          const containerMoveY = window.innerHeight * 0.3 * (progress / 0.3);

          gsap.set(heroHeader, {
            transform: 'translate(-50%, -50%)',
            opacity: 1 - progress / 0.3,
          });

          heroSection.style.backgroundColor = '#141414';

          gsap.set(animatedIcons, {
            x: 0,
            y: -containerMoveY,
            scale: 1,
            opacity: 1,
          });

          iconElements.forEach((icon, index) => {
            const iconProgress = gsap.utils.mapRange(
              index * 0.1,
              index * 0.1 + 0.2,
              0,
              1,
              progress
            );
            const clampedProgress = Math.max(0, Math.min(1, iconProgress));

            const startOffset = -containerMoveY;
            const individualY = startOffset * (1 - clampedProgress);

            gsap.set(icon, {
              x: 0,
              y: individualY,
            });
          });

          // Clean up duplicate icons if they exist
          cleanupDuplicateIcons();
        } else if (progress <= 0.6) {
          // Phase 2: Scale and center icons
          const scaleProgress = (progress - 0.3) / 0.3;

          gsap.set(heroHeader, {
            transform: 'translate(-50%, calc(-50% + -50px))',
            opacity: 0,
          });

          if (scaleProgress >= 0.5) {
            heroSection.style.backgroundColor = '#e3e3db';
          } else {
            heroSection.style.backgroundColor = '#141414';
          }

          cleanupDuplicateIcons();

          const targetCenterY = window.innerHeight / 2;
          const targetCenterX = window.innerWidth / 2;
          const containerRect = animatedIcons.getBoundingClientRect();
          const currentCenterX = containerRect.left + containerRect.width / 2;
          const currentCenterY = containerRect.top + containerRect.height / 2;
          const deltaX = (targetCenterX - currentCenterX) * scaleProgress;
          const deltaY = (targetCenterY - currentCenterY) * scaleProgress;
          const baseY = -window.innerHeight * 0.3;
          const currentScale = 1 + (exactScale - 1) * scaleProgress;

          gsap.set(animatedIcons, {
            x: deltaX,
            y: baseY + deltaY,
            scale: currentScale,
            opacity: 1,
          });

          iconElements.forEach((icon) => {
            gsap.set(icon, { x: 0, y: 0 });
          });
        } else if (progress <= 0.75) {
          // Phase 3: Move icons to placeholders
          const moveProgress = (progress - 0.6) / 0.15;

          gsap.set(heroHeader, {
            transform: 'translate(-50%, calc(-50% + -50px))',
            opacity: 0,
          });

          heroSection.style.backgroundColor = '#e3e3db';

          const targetCenterY = window.innerHeight / 2;
          const targetCenterX = window.innerWidth / 2;
          const containerRect = animatedIcons.getBoundingClientRect();
          const currentCenterX = containerRect.left + containerRect.width / 2;
          const currentCenterY = containerRect.top + containerRect.height / 2;
          const deltaX = targetCenterX - currentCenterX;
          const deltaY = targetCenterY - currentCenterY;
          const baseY = -window.innerHeight * 0.3;

          gsap.set(animatedIcons, {
            x: deltaX,
            y: baseY + deltaY,
            scale: exactScale,
            opacity: 0,
          });

          iconElements.forEach((icon) => {
            gsap.set(icon, { x: 0, y: 0 });
          });

          // Create duplicate icons if they don't exist
          if (duplicateIconsRef.current.length === 0) {
            iconElements.forEach((icon) => {
              const duplicate = icon.cloneNode(true) as HTMLElement;
              duplicate.className = 'duplicate-icon';
              duplicate.style.position = 'absolute';
              duplicate.style.width = headerIconSize + 'px';
              duplicate.style.height = headerIconSize + 'px';
              duplicate.style.zIndex = '1000';

              document.body.appendChild(duplicate);
              duplicateIconsRef.current.push(duplicate);
            });
          }

          // Animate duplicate icons
          duplicateIconsRef.current.forEach((duplicate, index) => {
            if (index < placeholders.length) {
              const iconRect = iconElements[index].getBoundingClientRect();
              const startCenterX = iconRect.left + iconRect.width / 2;
              const startCenterY = iconRect.top + iconRect.height / 2;
              const startPageX = startCenterX + window.pageXOffset;
              const startPageY = startCenterY + window.pageYOffset;

              const targetRect = placeholders[index].getBoundingClientRect();
              const targetCenterX = targetRect.left + targetRect.width / 2;
              const targetCenterY = targetRect.top + targetRect.height / 2;
              const targetPageX = targetCenterX + window.pageXOffset;
              const targetPageY = targetCenterY + window.pageYOffset;

              const moveX = targetPageX - startPageX;
              const moveY = targetPageY - startPageY;

              let currentX = 0;
              let currentY = 0;

              if (moveProgress <= 0.5) {
                const verticalProgress = moveProgress / 0.5;
                currentY = moveY * verticalProgress;
              } else {
                const horizontalProgress = (moveProgress - 0.5) / 0.5;
                currentY = moveY;
                currentX = moveX * horizontalProgress;
              }

              const finalPageX = startPageX + currentX;
              const finalPageY = startPageY + currentY;

              duplicate.style.left = finalPageX - headerIconSize / 2 + 'px';
              duplicate.style.top = finalPageY - headerIconSize / 2 + 'px';
              duplicate.style.opacity = '1';
              duplicate.style.display = 'flex';
            }
          });
        } else {
          // Phase 4: Final position and text animation
          gsap.set(heroHeader, {
            transform: 'translate(-50%, calc(-50% + -100px))',
            opacity: 0,
          });

          heroSection.style.backgroundColor = '#e3e3db';
          gsap.set(animatedIcons, { opacity: 0 });

          // Position final duplicate icons
          duplicateIconsRef.current.forEach((duplicate, index) => {
            if (index < placeholders.length) {
              const targetRect = placeholders[index].getBoundingClientRect();
              const targetCenterX = targetRect.left + targetRect.width / 2;
              const targetCenterY = targetRect.top + targetRect.height / 2;
              const targetPageX = targetCenterX + window.pageXOffset;
              const targetPageY = targetCenterY + window.pageYOffset;

              duplicate.style.left = targetPageX - headerIconSize / 2 + 'px';
              duplicate.style.top = targetPageY - headerIconSize / 2 + 'px';
              duplicate.style.opacity = '1';
              duplicate.style.display = 'flex';
            }
          });

          // Animate text segments
          textAnimationOrder.forEach((item, randomIndex) => {
            const segmentStart = 0.75 + randomIndex * 0.03;
            const segmentEnd = segmentStart + 0.015;

            const segmentProgress = gsap.utils.mapRange(segmentStart, segmentEnd, 0, 1, progress);
            const clampedProgress = Math.max(0, Math.min(1, segmentProgress));

            gsap.set(item.segment, {
              opacity: clampedProgress,
            });
          });
        }
      },
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      window.removeEventListener('resize', handleResize);
      cleanupDuplicateIcons();
    };
  }, []);

  return (
    <div ref={containerRef} className={`nvg8-scroll ${className || ''}`}>
      <section ref={heroRef} className="nvg8-hero">
        <div ref={heroHeaderRef} className="nvg8-hero-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div ref={animatedIconsRef} className="nvg8-animated-icons">
          {icons.map((icon) => (
            <div key={icon.id} className={`nvg8-animated-icon nvg8-icon-${icon.id}`}>
              <img src={icon.src} alt={icon.alt} />
            </div>
          ))}
        </div>

        <h1 ref={animatedTextRef} className="nvg8-animated-text">
          {textSegments.map((segment, index) => (
            <React.Fragment key={index}>
              {segment.hasPlaceholder && <div className="placeholder-icon"></div>}
              <span className="text-segment">{segment.text}</span>
            </React.Fragment>
          ))}
        </h1>
      </section>

      <section className="nvg8-outro">
        <h1>{outroTitle}</h1>
      </section>
    </div>
  );
};
