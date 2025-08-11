'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';

export interface RadgaHorizontalScrollSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
}

export interface RadgaHorizontalScrollProps {
  slides: RadgaHorizontalScrollSlide[];
  stickyHeight?: number;
  backgroundColor?: string;
  outroTitle?: string;
  outroBackgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RadgaHorizontalScroll({
  slides,
  stickyHeight = 6,
  backgroundColor = '#b4aea7',
  outroTitle = 'Shaping timeless spaces with contemporary vision',
  outroBackgroundColor = '#141414',
  className = '',
  style = {},
}: RadgaHorizontalScrollProps) {
  const stickyRef = useRef<HTMLElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentVisibleIndexRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!stickyRef.current || !slidesContainerRef.current || !sliderRef.current) return;

    // Register GSAP plugins
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const stickySection = stickyRef.current;
    const slidesContainer = slidesContainerRef.current;
    const slider = sliderRef.current;
    const slideElements = slideRefs.current.filter(Boolean) as HTMLDivElement[];

    // Calculate dimensions
    const stickyHeightPx = window.innerHeight * stickyHeight;
    const totalMove = slidesContainer.offsetWidth - slider.offsetWidth;
    const slideWidth = slider.offsetWidth;

    // Initialize title positions
    slideElements.forEach((slide) => {
      const title = slide.querySelector('.title h1') as HTMLElement;
      if (title) {
        gsap.set(title, { y: -200 });
      }
    });

    // Intersection Observer for title animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const currentIndex = slideElements.indexOf(entry.target as HTMLDivElement);
          const titles = slideElements
            .map((slide) => slide.querySelector('.title h1') as HTMLElement)
            .filter(Boolean);

          if (entry.intersectionRatio >= 0.25) {
            currentVisibleIndexRef.current = currentIndex;
            titles.forEach((title, index) => {
              gsap.to(title, {
                y: index === currentIndex ? 0 : -200,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true,
              });
            });
          } else if (
            entry.intersectionRatio < 0.25 &&
            currentVisibleIndexRef.current === currentIndex
          ) {
            const prevIndex = currentIndex - 1;
            currentVisibleIndexRef.current = prevIndex >= 0 ? prevIndex : null;

            titles.forEach((title, index) => {
              gsap.to(title, {
                y: index === prevIndex ? 0 : -200,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true,
              });
            });
          }
        });
      },
      {
        root: slider,
        threshold: [0, 0.25],
      }
    );

    observerRef.current = observer;
    slideElements.forEach((slide) => observer.observe(slide));

    // Main ScrollTrigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: 'top top',
      end: `+=${stickyHeightPx}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const mainMove = progress * totalMove;

        gsap.set(slidesContainer, {
          x: -mainMove,
        });

        const currentSlide = Math.floor(mainMove / slideWidth);
        const slideProgress = (mainMove % slideWidth) / slideWidth;

        slideElements.forEach((slide, index) => {
          const image = slide.querySelector('img') as HTMLImageElement;
          if (image) {
            if (index === currentSlide || index === currentSlide + 1) {
              const relativeProgress = index === currentSlide ? slideProgress : slideProgress - 1;
              const parallaxAmount = relativeProgress * slideWidth * 0.25;
              gsap.set(image, {
                x: parallaxAmount,
                scale: 1.35,
              });
            } else {
              gsap.set(image, {
                x: 0,
                scale: 1.35,
              });
            }
          }
        });
      },
    });

    return () => {
      scrollTrigger.kill();
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [slides, stickyHeight]);

  return (
    <div className={className} style={style}>
      {/* Sticky horizontal scroll section */}
      <section
        ref={stickyRef}
        className="radga-sticky"
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          padding: '1.5em',
          overflow: 'hidden',
          backgroundColor,
        }}
      >
        <div
          ref={sliderRef}
          className="radga-slider"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            ref={slidesContainerRef}
            className="radga-slides"
            style={{
              position: 'relative',
              width: `${slides.length * 100}%`,
              height: '100%',
              display: 'flex',
              willChange: 'transform',
              transform: 'translateX(0)',
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
                className="radga-slide"
                style={{
                  position: 'relative',
                  flex: 1,
                  height: '100%',
                }}
              >
                <div
                  className="radga-img"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      willChange: 'transform, scale',
                      transform: 'translateX(0) scale(1.35)',
                    }}
                  />
                </div>
                <div
                  className="title"
                  style={{
                    position: 'relative',
                    width: 'max-content',
                    height: '200px',
                    margin: '1.5em',
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                    zIndex: 2,
                  }}
                >
                  <h1
                    style={{
                      position: 'relative',
                      color: '#fff',
                      textTransform: 'uppercase',
                      fontSize: '85px',
                      fontWeight: 900,
                      letterSpacing: '-2px',
                      lineHeight: '0.9',
                      willChange: 'transform',
                      fontFamily: 'Gilroy, Arial, sans-serif',
                    }}
                  >
                    {slide.title}
                    {slide.subtitle && (
                      <>
                        <br />
                        {slide.subtitle}
                      </>
                    )}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outro section */}
      <section
        className="radga-outro"
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          padding: '1.5em',
          overflow: 'hidden',
          backgroundColor: outroBackgroundColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: '#fff',
            textTransform: 'uppercase',
            fontSize: '60px',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: '0.9',
            fontFamily: 'Gilroy, Arial, sans-serif',
          }}
        >
          {outroTitle}
        </h1>
      </section>
    </div>
  );
}
