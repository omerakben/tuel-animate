'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';
import './TelescopeScroll.css';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SpotlightItem {
  name: string;
  img: string;
}

interface TelescopeScrollProps {
  className?: string;
  spotlightItems?: SpotlightItem[];
  introText?: string;
  outroText?: string;
  spotlightHeaderText?: string;
  config?: {
    gap: number;
    speed: number;
    arcRadius: number;
  };
}

const defaultSpotlightItems: SpotlightItem[] = [
  {
    name: 'Silent Arc',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
  {
    name: 'Bloom24',
    img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
  },
  {
    name: 'Glass Fade',
    img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
  },
  {
    name: 'Echo 9',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  },
  {
    name: 'Velvet Loop',
    img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  },
  {
    name: 'Field Two',
    img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop',
  },
  {
    name: 'Pale Thread',
    img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
  },
  {
    name: 'Stillroom',
    img: 'https://images.unsplash.com/photo-1482189349482-3defd547e0e9?w=400&h=300&fit=crop',
  },
  {
    name: 'Ghostline',
    img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop',
  },
  {
    name: 'Mono 73',
    img: 'https://images.unsplash.com/photo-1433477155337-9aea4e790195?w=400&h=300&fit=crop',
  },
];

const defaultConfig = {
  gap: 0.08,
  speed: 0.3,
  arcRadius: 500,
};

export const TelescopeScroll: React.FC<TelescopeScrollProps> = ({
  className = '',
  spotlightItems = defaultSpotlightItems,
  introText = 'Curated frames in a dance of time.',
  outroText = 'Every frame tells a story.',
  spotlightHeaderText = 'Moments in still motion',
  config = defaultConfig,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const titlesContainerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const spotlightHeaderRef = useRef<HTMLDivElement>(null);
  const introText1Ref = useRef<HTMLParagraphElement>(null);
  const introText2Ref = useRef<HTMLParagraphElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);
  const bgImgElementRef = useRef<HTMLImageElement>(null);

  const imageElementsRef = useRef<HTMLDivElement[]>([]);
  const titleElementsRef = useRef<HTMLHeadingElement[]>([]);
  const currentActiveIndexRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current || !spotlightRef.current) return;

    const titlesContainer = titlesRef.current;
    const imagesContainer = imagesContainerRef.current;

    if (!titlesContainer || !imagesContainer) return;

    // Clear existing elements
    titlesContainer.innerHTML = '';
    imagesContainer.innerHTML = '';
    imageElementsRef.current = [];
    titleElementsRef.current = [];

    spotlightItems.forEach((item, index) => {
      // Create title element
      const titleElement = document.createElement('h1');
      titleElement.textContent = item.name;
      titleElement.className = 'spotlight-title';
      titleElement.style.opacity = index === 0 ? '1' : '0.25';
      titlesContainer.appendChild(titleElement);
      titleElementsRef.current.push(titleElement);

      // Create image element
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'spotlight-img';
      const imgElement = document.createElement('img');
      imgElement.src = item.img;
      imgElement.alt = item.name;
      imgWrapper.appendChild(imgElement);
      imagesContainer.appendChild(imgWrapper);
      imageElementsRef.current.push(imgWrapper);
    });

    // Set initial background image
    if (bgImgElementRef.current && spotlightItems.length > 0) {
      bgImgElementRef.current.src = spotlightItems[0].img;
    }

    // Animation utility functions
    const getBezierPosition = (t: number) => {
      const containerWidth = window.innerWidth * 0.3;
      const containerHeight = window.innerHeight;
      const arcStartX = containerWidth - 220;
      const arcStartY = -200;
      const arcEndY = containerHeight + 200;
      const arcControlPointX = arcStartX + config.arcRadius;
      const arcControlPointY = containerHeight / 2;

      const x =
        (1 - t) * (1 - t) * arcStartX + 2 * (1 - t) * t * arcControlPointX + t * t * arcStartX;
      const y =
        (1 - t) * (1 - t) * arcStartY + 2 * (1 - t) * t * arcControlPointY + t * t * arcEndY;
      return { x, y };
    };

    const getImgProgressState = (index: number, overallProgress: number) => {
      const startTime = index * config.gap;
      const endTime = startTime + config.speed;
      if (overallProgress < startTime) return -1;
      if (overallProgress > endTime) return 2;
      return (overallProgress - startTime) / config.speed;
    };

    // Set initial states
    imageElementsRef.current.forEach((img) => gsap.set(img, { opacity: 0 }));

    // Main scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: spotlightRef.current,
      start: 'top top',
      end: `+=${window.innerHeight * 10}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress <= 0.2) {
          // Intro phase
          const animationProgress = progress / 0.2;
          const moveDistance = window.innerWidth * 0.6;

          if (introText1Ref.current && introText2Ref.current) {
            gsap.set(introText1Ref.current, {
              x: -animationProgress * moveDistance,
              opacity: 1,
            });
            gsap.set(introText2Ref.current, {
              x: animationProgress * moveDistance,
              opacity: 1,
            });
          }

          if (bgImgRef.current && bgImgElementRef.current) {
            gsap.set(bgImgRef.current, {
              transform: `scale(${animationProgress})`,
            });
            gsap.set(bgImgElementRef.current, {
              transform: `scale(${1.5 - animationProgress * 0.5})`,
            });
          }

          imageElementsRef.current.forEach((img) => gsap.set(img, { opacity: 0 }));

          if (spotlightHeaderRef.current) {
            spotlightHeaderRef.current.style.opacity = '0';
          }

          if (titlesContainerRef.current) {
            gsap.set(titlesContainerRef.current, {
              '--before-opacity': '0',
              '--after-opacity': '0',
            } as any);
          }
        } else if (progress > 0.2 && progress <= 0.25) {
          // Transition phase
          if (bgImgRef.current && bgImgElementRef.current) {
            gsap.set(bgImgRef.current, { transform: 'scale(1)' });
            gsap.set(bgImgElementRef.current, { transform: 'scale(1)' });
          }

          if (introText1Ref.current && introText2Ref.current) {
            gsap.set(introText1Ref.current, { opacity: 0 });
            gsap.set(introText2Ref.current, { opacity: 0 });
          }

          imageElementsRef.current.forEach((img) => gsap.set(img, { opacity: 0 }));

          if (spotlightHeaderRef.current) {
            spotlightHeaderRef.current.style.opacity = '1';
          }

          if (titlesContainerRef.current) {
            gsap.set(titlesContainerRef.current, {
              '--before-opacity': '1',
              '--after-opacity': '1',
            } as any);
          }
        } else if (progress > 0.25 && progress <= 0.95) {
          // Main spotlight phase
          const switchProgress = (progress - 0.25) / 0.7;
          const viewportHeight = window.innerHeight;
          const titlesContainer = titlesRef.current;

          if (titlesContainer) {
            const titlesContainerHeight = titlesContainer.scrollHeight;
            const startPosition = viewportHeight;
            const targetPosition = -titlesContainerHeight;
            const totalDistance = startPosition - targetPosition;
            const currentY = startPosition - switchProgress * totalDistance;

            gsap.set(titlesContainer, {
              transform: `translateY(${currentY}px)`,
            });
          }

          // Animate images along bezier curve
          imageElementsRef.current.forEach((img, index) => {
            const imageProgress = getImgProgressState(index, switchProgress);

            if (imageProgress < 0 || imageProgress > 1) {
              gsap.set(img, { opacity: 0 });
            } else {
              const pos = getBezierPosition(imageProgress);
              gsap.set(img, {
                x: pos.x - 100,
                y: pos.y - 75,
                opacity: 1,
              });
            }
          });

          // Update active title
          const viewportMiddle = viewportHeight / 2;
          let closestIndex = 0;
          let closestDistance = Infinity;

          titleElementsRef.current.forEach((title, index) => {
            const titleRect = title.getBoundingClientRect();
            const titleCenter = titleRect.top + titleRect.height / 2;
            const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);

            if (distanceFromCenter < closestDistance) {
              closestDistance = distanceFromCenter;
              closestIndex = index;
            }
          });

          if (closestIndex !== currentActiveIndexRef.current) {
            if (titleElementsRef.current[currentActiveIndexRef.current]) {
              titleElementsRef.current[currentActiveIndexRef.current].style.opacity = '0.25';
            }
            titleElementsRef.current[closestIndex].style.opacity = '1';

            if (bgImgElementRef.current) {
              bgImgElementRef.current.src = spotlightItems[closestIndex].img;
            }

            currentActiveIndexRef.current = closestIndex;
          }
        } else if (progress > 0.95) {
          // Outro phase
          if (spotlightHeaderRef.current) {
            spotlightHeaderRef.current.style.opacity = '0';
          }

          if (titlesContainerRef.current) {
            gsap.set(titlesContainerRef.current, {
              '--before-opacity': '0',
              '--after-opacity': '0',
            } as any);
          }
        }
      },
    });

    return () => {
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [spotlightItems, config]);

  return (
    <div ref={containerRef} className={`telescope-scroll ${className}`}>
      <section className="intro">
        <p>{introText}</p>
      </section>

      <section ref={spotlightRef} className="spotlight">
        <div className="spotlight-intro-text-wrapper">
          <p ref={introText1Ref} className="spotlight-intro-text spotlight-intro-text-1">
            Beneath
          </p>
          <p ref={introText2Ref} className="spotlight-intro-text spotlight-intro-text-2">
            Beyond
          </p>
        </div>

        <div ref={bgImgRef} className="spotlight-bg-img">
          <img
            ref={bgImgElementRef}
            src={spotlightItems.length > 0 ? spotlightItems[0].img : ''}
            alt=""
          />
        </div>

        <div ref={titlesContainerRef} className="spotlight-titles-container">
          <div ref={titlesRef} className="spotlight-titles">
            {/* Dynamic titles will be added here */}
          </div>
        </div>

        <div ref={imagesContainerRef} className="spotlight-images">
          {/* Dynamic images will be added here */}
        </div>

        <div ref={spotlightHeaderRef} className="spotlight-header">
          <p>{spotlightHeaderText}</p>
        </div>
      </section>

      <section className="outro">
        <p>{outroText}</p>
      </section>
    </div>
  );
};

export default TelescopeScroll;
