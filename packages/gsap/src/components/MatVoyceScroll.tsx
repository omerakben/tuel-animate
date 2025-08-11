'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';
import './MatVoyceScroll.css';

gsap.registerPlugin(ScrollTrigger);

// Lenis type definitions
interface LenisOptions {
  lerp?: number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

declare class Lenis {
  constructor(options?: LenisOptions);
  on(event: string, callback: (data?: any) => void): void;
  raf(time: number): void;
  destroy(): void;
}

interface CardPosition {
  top: string;
  left: string;
}

interface TitleData {
  text: string;
}

interface MatVoyceScrollProps {
  logo?: string;
  taglineMain?: string;
  taglineSecondary?: string;
  aboutMain?: string;
  aboutSecondary?: string;
  heroTitle?: string;
  titles?: TitleData[];
  cardImages?: string[];
  cardPositions?: CardPosition[];
  outroTitle?: string;
  className?: string;
}

const defaultCardPositions: CardPosition[] = [
  { top: '30%', left: '55%' },
  { top: '20%', left: '25%' },
  { top: '50%', left: '10%' },
  { top: '60%', left: '40%' },
  { top: '30%', left: '30%' },
  { top: '60%', left: '60%' },
  { top: '20%', left: '50%' },
  { top: '60%', left: '10%' },
  { top: '20%', left: '40%' },
  { top: '45%', left: '55%' },
];

const defaultTitles: TitleData[] = [
  { text: 'Showcase Hub' },
  { text: 'Nova Stream' },
  { text: 'Circle 30' },
  { text: 'Bites & Banter' },
  { text: 'Digital Flow' },
  { text: 'Creative Lab' },
  { text: 'Brand Studio' },
  { text: 'Motion Works' },
];

const defaultCardImages: string[] = [
  '/api/placeholder/400/600',
  '/api/placeholder/400/600',
  '/api/placeholder/400/600',
  '/api/placeholder/400/600',
  '/api/placeholder/400/600',
  '/api/placeholder/400/600',
  '/api/placeholder/400/600',
  '/api/placeholder/400/600',
  '/api/placeholder/400/600',
  '/api/placeholder/400/600',
];

export const MatVoyceScroll: React.FC<MatVoyceScrollProps> = ({
  logo = '/api/placeholder/120/40',
  taglineMain = 'Your go-to creative powerhouse for',
  taglineSecondary = 'design, branding, and motion.',
  aboutMain = 'Headquartered in Toronto',
  aboutSecondary = 'Collaborating worldwide',
  heroTitle = '(Scroll if you dare)',
  titles = defaultTitles,
  cardImages = defaultCardImages,
  cardPositions = defaultCardPositions,
  outroTitle = 'The End',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current || !titlesRef.current || !imagesRef.current)
      return;

    const sticky = stickyRef.current;
    const titlesContainer = titlesRef.current;
    const imagesContainer = imagesRef.current;

    // Initialize Lenis with fallback for when library is not available
    let lenis: Lenis | null = null;

    try {
      // Dynamic import for Lenis to avoid build issues
      if (typeof window !== 'undefined' && (window as any).Lenis) {
        lenis = new (window as any).Lenis({
          lerp: 0.1,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        });

        lenis?.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis?.raf(time * 1000);
        });
      }
    } catch (error) {
      console.warn('Lenis not available, using default scroll');
    }

    gsap.ticker.lagSmoothing(0);

    // Create cards dynamically
    const cardsData: HTMLElement[] = [];
    for (let i = 0; i < Math.min(cardImages.length, cardPositions.length); i++) {
      const card = document.createElement('div');
      card.className = `mat-voyce-card mat-voyce-card-${i + 1}`;

      const img = document.createElement('img');
      img.src = cardImages[i];
      img.alt = `Image ${i + 1}`;
      card.appendChild(img);

      const position = cardPositions[i];
      card.style.top = position.top;
      card.style.left = position.left;

      imagesContainer.appendChild(card);
      cardsData.push(card);
    }

    // Set initial card states
    cardsData.forEach((card) => {
      gsap.set(card, {
        z: -50000,
        scale: 0,
      });
    });

    const moveDistance = window.innerWidth * 3;

    // Main scroll animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: sticky,
      start: 'top top',
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Move titles horizontally
        const xPosition = -moveDistance * progress;
        gsap.set(titlesContainer, {
          x: xPosition,
        });

        // Velocity-based text effects
        const velocity = self.getVelocity();
        const normalizedVelocity = velocity / Math.abs(velocity) || 0;
        const maxOffset = 30;
        const currentSpeed = Math.min(Math.abs(velocity / 500), maxOffset);
        const isAtEdge = progress <= 0 || progress >= 1;

        // Animate title layers with velocity
        const titleContainers = titlesContainer.querySelectorAll('.mat-voyce-title');
        titleContainers.forEach((titleContainer) => {
          const title1 = titleContainer.querySelector('.mat-voyce-title-1') as HTMLElement;
          const title2 = titleContainer.querySelector('.mat-voyce-title-2') as HTMLElement;
          const title3 = titleContainer.querySelector('.mat-voyce-title-3') as HTMLElement;

          if (isAtEdge) {
            gsap.to([title1, title2], {
              xPercent: -50,
              x: 0,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: true,
            });
          } else {
            const baseOffset = normalizedVelocity * currentSpeed;

            gsap.to(title1, {
              xPercent: -50,
              x: `${baseOffset * 4}px`,
              duration: 0.2,
              ease: 'power1.out',
              overwrite: 'auto',
            });

            gsap.to(title2, {
              xPercent: -50,
              x: `${baseOffset * 2}px`,
              duration: 0.2,
              ease: 'power1.out',
              overwrite: 'auto',
            });
          }

          gsap.set(title3, {
            xPercent: -50,
            x: 0,
          });
        });

        // Animate cards with staggered 3D effect
        cardsData.forEach((card, index) => {
          const staggerOffset = index * 0.075;
          const scaledProgress = (progress - staggerOffset) * 3;
          const individualProgress = Math.max(0, Math.min(1, scaledProgress));
          const targetZ = index === cardsData.length - 1 ? 1500 : 2000;
          const newZ = -50000 + (targetZ + 50000) * individualProgress;
          const scaleProgress = Math.min(1, individualProgress * 10);
          const scale = Math.max(0, Math.min(1, scaleProgress));

          gsap.set(card, {
            z: newZ,
            scale: scale,
          });
        });
      },
    });

    // Cleanup function
    return () => {
      scrollTrigger.kill();
      lenis?.destroy();

      // Clean up dynamically created cards
      cardsData.forEach((card) => {
        if (card.parentNode) {
          card.parentNode.removeChild(card);
        }
      });
    };
  }, [cardImages, cardPositions]);

  return (
    <div ref={containerRef} className={`mat-voyce-scroll ${className || ''}`}>
      <nav className="mat-voyce-nav">
        <div className="mat-voyce-logo">
          <div className="mat-voyce-logo-img">
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <div className="mat-voyce-tagline">
          <p>
            {taglineMain}
            <br />
            <span>{taglineSecondary}</span>
          </p>
        </div>
        <div className="mat-voyce-about">
          <p>{aboutMain}</p>
          <p>
            <span>{aboutSecondary}</span>
          </p>
        </div>
      </nav>

      <section className="mat-voyce-hero">
        <h1>{heroTitle}</h1>
      </section>

      <section ref={stickyRef} className="mat-voyce-sticky">
        <div ref={titlesRef} className="mat-voyce-titles">
          {titles.map((title, index) => (
            <div key={index} className="mat-voyce-title">
              <h1 className="mat-voyce-title-1">{title.text}</h1>
              <h1 className="mat-voyce-title-2">{title.text}</h1>
              <h1 className="mat-voyce-title-3">{title.text}</h1>
            </div>
          ))}
        </div>
        <div ref={imagesRef} className="mat-voyce-images"></div>
      </section>

      <section className="mat-voyce-outro">
        <h1>{outroTitle}</h1>
      </section>
    </div>
  );
};
