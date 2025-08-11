'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import React, { useEffect, useRef } from 'react';
import './TelescopeImageScroll.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface TelescopeImageScrollProps {
  className?: string;
  heroText?: string;
  outroText?: string;
  bannerHeaderText?: string;
  leftIntroText?: string;
  rightIntroText?: string;
  bannerImage?: string;
  maskLayers?: number;
}

export const TelescopeImageScroll: React.FC<TelescopeImageScrollProps> = ({
  className = '',
  heroText = 'The frame is only the beginning.',
  outroText = "And that's the silhouette.",
  bannerHeaderText = 'The Season Wears Confidence',
  leftIntroText = 'Surface',
  rightIntroText = 'Layered',
  bannerImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  maskLayers = 6,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerContainerRef = useRef<HTMLDivElement>(null);
  const bannerHeaderRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !bannerContainerRef.current) return;

    const bannerContainer = bannerContainerRef.current;
    const bannerIntroTextElements = [leftTextRef.current, rightTextRef.current];
    const bannerMaskLayers = bannerContainer.querySelectorAll('.mask');
    const bannerHeader = bannerHeaderRef.current?.querySelector('h1');

    // Split text for animation
    let splitText: any = null;
    let words: Element[] = [];

    if (bannerHeader) {
      splitText = new SplitText(bannerHeader, { type: 'words' });
      words = splitText.words;
      gsap.set(words, { opacity: 0 });
    }

    // Set initial states for mask layers
    bannerMaskLayers.forEach((layer, i) => {
      gsap.set(layer, { scale: 0.9 - i * 0.2 });
    });
    gsap.set(bannerContainer, { scale: 0 });

    // Main scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: '.banner',
      start: 'top top',
      end: `+=${window.innerHeight * 4}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Scale banner container
        gsap.set(bannerContainer, { scale: progress });

        // Animate mask layers
        bannerMaskLayers.forEach((layer, i) => {
          const initialScale = 0.9 - i * 0.2;
          const layerProgress = Math.min(progress / 0.9, 1.0);
          const currentScale = initialScale + layerProgress * (1.0 - initialScale);
          gsap.set(layer, { scale: currentScale });
        });

        // Animate intro texts (0-90% progress)
        if (progress <= 0.9) {
          const textProgress = progress / 0.9;
          const moveDistance = window.innerWidth * 0.5;

          if (bannerIntroTextElements[0]) {
            gsap.set(bannerIntroTextElements[0], {
              x: -textProgress * moveDistance,
            });
          }
          if (bannerIntroTextElements[1]) {
            gsap.set(bannerIntroTextElements[1], {
              x: textProgress * moveDistance,
            });
          }
        }

        // Animate header text reveal (70-90% progress)
        if (progress >= 0.7 && progress <= 0.9 && words.length > 0) {
          const headerProgress = (progress - 0.7) / 0.2;
          const totalWords = words.length;

          words.forEach((word, i) => {
            const wordStartDelay = i / totalWords;
            const wordEndDelay = (i + 1) / totalWords;

            let wordOpacity = 0;

            if (headerProgress >= wordEndDelay) {
              wordOpacity = 1;
            } else if (headerProgress >= wordStartDelay) {
              const wordProgress =
                (headerProgress - wordStartDelay) / (wordEndDelay - wordStartDelay);
              wordOpacity = wordProgress;
            }

            gsap.set(word, { opacity: wordOpacity });
          });
        } else if (progress < 0.7 && words.length > 0) {
          gsap.set(words, { opacity: 0 });
        } else if (progress > 0.9 && words.length > 0) {
          gsap.set(words, { opacity: 1 });
        }
      },
    });

    return () => {
      if (splitText) {
        splitText.revert();
      }
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [maskLayers]);

  return (
    <div ref={containerRef} className={`telescope-image-scroll ${className}`}>
      <section className="hero">
        <h1>{heroText}</h1>
      </section>

      <section className="banner">
        <div ref={bannerContainerRef} className="banner-img-container">
          {/* Base image */}
          <div className="img">
            <img src={bannerImage} alt="" />
          </div>

          {/* Mask layers */}
          {Array.from({ length: maskLayers }, (_, i) => (
            <div key={i} className="img mask">
              <img src={bannerImage} alt="" />
            </div>
          ))}

          <div ref={bannerHeaderRef} className="banner-header">
            <h1>{bannerHeaderText}</h1>
          </div>
        </div>

        <div className="banner-intro-text-container">
          <div ref={leftTextRef} className="banner-intro-text">
            <h1>{leftIntroText}</h1>
          </div>
          <div ref={rightTextRef} className="banner-intro-text">
            <h1>{rightIntroText}</h1>
          </div>
        </div>
      </section>

      <section className="outro">
        <h1>{outroText}</h1>
      </section>
    </div>
  );
};

export default TelescopeImageScroll;
