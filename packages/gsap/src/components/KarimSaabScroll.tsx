'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ImageData {
  src: string;
  alt: string;
}

interface KarimSaabScrollProps {
  images?: ImageData[];
  spotlightImage?: string;
  spotlightMask?: string;
  className?: string;
  title1?: string;
  title2?: string;
  title3?: string;
  logoSrc?: string;
}

const defaultImages: ImageData[] = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=560&fit=crop',
    alt: 'Image 1',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=560&fit=crop',
    alt: 'Image 2',
  },
  {
    src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=560&fit=crop',
    alt: 'Image 3',
  },
  {
    src: 'https://images.unsplash.com/photo-1515041219749-89347f83291a?w=400&h=560&fit=crop',
    alt: 'Image 4',
  },
  {
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=560&fit=crop',
    alt: 'Image 5',
  },
  {
    src: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=560&fit=crop',
    alt: 'Image 6',
  },
  {
    src: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=560&fit=crop',
    alt: 'Image 7',
  },
  {
    src: 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=400&h=560&fit=crop',
    alt: 'Image 8',
  },
  {
    src: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=400&h=560&fit=crop',
    alt: 'Image 9',
  },
];

export const KarimSaabScroll: React.FC<KarimSaabScrollProps> = ({
  images = defaultImages,
  spotlightImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
  spotlightMask = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K',
  className = '',
  title1 = 'Awaken the Scroll',
  title2 = 'Where Frames Fade Into Fate',
  title3 = 'The Last Frame Hits Hard',
  logoSrc = '⚛️',
}) => {
  const spotlightImagesRef = useRef<HTMLDivElement>(null);
  const maskContainerRef = useRef<HTMLDivElement>(null);
  const maskImageRef = useRef<HTMLDivElement>(null);
  const maskHeaderRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  // Helper function to split text into words
  const splitTextIntoWords = (text: string) => {
    return text.split(' ').map((word, index) => (
      <span key={index} className="spotlight-word" style={{ opacity: 0 }}>
        {word}
        {index < text.split(' ').length - 1 && ' '}
      </span>
    ));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const spotlightImages = spotlightImagesRef.current;
    const maskContainer = maskContainerRef.current;
    const maskImage = maskImageRef.current;
    const maskHeader = maskHeaderRef.current;

    if (!spotlightImages || !maskContainer || !maskImage || !maskHeader) return;

    const spotlightContainerHeight = spotlightImages.offsetHeight;
    const viewportHeight = window.innerHeight;
    const initialOffset = spotlightContainerHeight * 0.05;
    const totalMovement = spotlightContainerHeight + initialOffset + viewportHeight;

    const words = maskHeader.querySelectorAll('.spotlight-word');

    const scrollTrigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: 'top top',
      end: `+=${window.innerHeight * 7}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Images movement (first 50% of scroll)
        if (progress <= 0.5) {
          const imagesMoveProgress = progress / 0.5;
          const startY = 5;
          const endY = -(totalMovement / spotlightContainerHeight) * 100;
          const currentY = startY + (endY - startY) * imagesMoveProgress;

          gsap.set(spotlightImages, {
            y: `${currentY}%`,
          });
        }

        // Mask reveal (25% to 75% of scroll)
        if (progress >= 0.25 && progress <= 0.75) {
          const maskProgress = (progress - 0.25) / 0.5;
          const maskSize = `${maskProgress * 450}%`;
          const imageScale = 1.5 - maskProgress * 0.5;

          maskContainer.style.setProperty('-webkit-mask-size', maskSize);
          maskContainer.style.setProperty('mask-size', maskSize);

          gsap.set(maskImage, {
            scale: imageScale,
          });
        } else if (progress < 0.25) {
          maskContainer.style.setProperty('-webkit-mask-size', '0%');
          maskContainer.style.setProperty('mask-size', '0%');
          gsap.set(maskImage, {
            scale: 1.5,
          });
        } else if (progress > 0.75) {
          maskContainer.style.setProperty('-webkit-mask-size', '450%');
          maskContainer.style.setProperty('mask-size', '450%');
          gsap.set(maskImage, {
            scale: 1,
          });
        }

        // Text reveal (75% to 95% of scroll)
        if (words.length > 0) {
          if (progress >= 0.75 && progress <= 0.95) {
            const textProgress = (progress - 0.75) / 0.2;
            const totalWords = words.length;

            words.forEach((word, index) => {
              const wordRevealProgress = index / totalWords;
              if (textProgress >= wordRevealProgress) {
                gsap.set(word, { opacity: 1 });
              } else {
                gsap.set(word, { opacity: 0 });
              }
            });
          } else if (progress < 0.75) {
            gsap.set(words, { opacity: 0 });
          } else if (progress > 0.95) {
            gsap.set(words, { opacity: 1 });
          }
        }
      },
    });

    return () => {
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [images, spotlightImage, title3]);

  // Create image grid with proper spacing
  const createImageGrid = () => {
    const rows = [
      [null, images[0], null, images[1]],
      [images[2], null, null, null],
      [null, images[3], images[4], null],
      [null, images[5], null, images[6]],
      [images[7], null, images[8], null],
    ];

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((image, colIndex) => (
          <div key={colIndex} className="img">
            {image && <img src={image.src} alt={image.alt} />}
          </div>
        ))}
      </div>
    ));
  };

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '300vh',
  };

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '35%',
    padding: '1rem 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '0.5rem',
    zIndex: 2,
  };

  const sectionStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#161616',
    color: '#fff',
    overflow: 'hidden',
  };

  const introStyle: React.CSSProperties = {
    ...sectionStyle,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const spotlightStyle: React.CSSProperties = {
    ...sectionStyle,
    backgroundColor: '#101010',
  };

  const outroStyle: React.CSSProperties = {
    ...sectionStyle,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    width: '50%',
    zIndex: 1,
  };

  const h1Style: React.CSSProperties = {
    textTransform: 'uppercase',
    fontFamily: '"Barlow Condensed", sans-serif',
    fontSize: '6rem',
    fontWeight: 900,
    lineHeight: 0.85,
    letterSpacing: '-0.02rem',
    margin: 0,
  };

  const spotlightImagesStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '300vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transform: 'translateY(5%)',
    willChange: 'transform',
  };

  const rowStyle: React.CSSProperties = {
    width: '100%',
    padding: '2rem',
    display: 'flex',
    gap: '2rem',
  };

  const imgStyle: React.CSSProperties = {
    flex: 1,
    aspectRatio: '5/7',
    overflow: 'hidden',
  };

  const imgImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.5,
    filter: 'saturate(0)',
  };

  const maskContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    WebkitMask: `url(${spotlightMask}) center/contain no-repeat`,
    mask: `url(${spotlightMask}) center/contain no-repeat`,
    overflow: 'hidden',
    WebkitMaskSize: '0%',
    maskSize: '0%',
    zIndex: 10,
  };

  const maskImgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
  };

  return (
    <div className={className} style={containerStyle}>
      <nav style={navStyle}>
        <div style={{ fontSize: '1.5rem' }}>{logoSrc}</div>
      </nav>

      <section style={introStyle}>
        <div style={headerStyle}>
          <h1 style={h1Style}>{title1}</h1>
        </div>
      </section>

      <section ref={triggerRef} style={spotlightStyle}>
        <div style={headerStyle}>
          <h1 style={h1Style}>{title2}</h1>
        </div>

        <div ref={spotlightImagesRef} style={spotlightImagesStyle}>
          {createImageGrid().map((row, index) => (
            <div key={index} style={rowStyle}>
              {row.props.children.map((img: React.ReactElement, imgIndex: number) => (
                <div key={imgIndex} style={imgStyle}>
                  {img.props.children && (
                    <img
                      src={img.props.children.props.src}
                      alt={img.props.children.props.alt}
                      style={imgImageStyle}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div ref={maskContainerRef} style={maskContainerStyle}>
          <div ref={maskImageRef} style={maskImgStyle}>
            <img
              src={spotlightImage}
              alt="Spotlight"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={headerStyle}>
            <h1 ref={maskHeaderRef} style={h1Style}>
              {splitTextIntoWords(title3)}
            </h1>
          </div>
        </div>
      </section>

      <section style={outroStyle}>
        <h1 style={h1Style}>End of Act One</h1>
      </section>
    </div>
  );
};
