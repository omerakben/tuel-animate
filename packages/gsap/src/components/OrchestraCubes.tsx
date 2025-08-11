'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef } from 'react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CubeData {
  initial: {
    top: number;
    left: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    z: number;
  };
  final: {
    top: number;
    left: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    z: number;
  };
}

const cubesData: Record<string, CubeData> = {
  'cube-1': {
    initial: {
      top: -55,
      left: 37.5,
      rotateX: 360,
      rotateY: -360,
      rotateZ: -48,
      z: -30000,
    },
    final: {
      top: 50,
      left: 15,
      rotateX: 0,
      rotateY: 3,
      rotateZ: 0,
      z: 0,
    },
  },
  'cube-2': {
    initial: {
      top: -35,
      left: 32.5,
      rotateX: -360,
      rotateY: 360,
      rotateZ: 90,
      z: -30000,
    },
    final: {
      top: 75,
      left: 25,
      rotateX: 1,
      rotateY: 2,
      rotateZ: 0,
      z: 0,
    },
  },
  'cube-3': {
    initial: {
      top: -65,
      left: 50,
      rotateX: -360,
      rotateY: -360,
      rotateZ: -180,
      z: -30000,
    },
    final: {
      top: 25,
      left: 25,
      rotateX: -1,
      rotateY: 2,
      rotateZ: 0,
      z: 0,
    },
  },
  'cube-4': {
    initial: {
      top: -35,
      left: 50,
      rotateX: -360,
      rotateY: -360,
      rotateZ: -180,
      z: -30000,
    },
    final: {
      top: 75,
      left: 75,
      rotateX: 1,
      rotateY: -2,
      rotateZ: 0,
      z: 0,
    },
  },
  'cube-5': {
    initial: {
      top: -55,
      left: 62.5,
      rotateX: 360,
      rotateY: 360,
      rotateZ: -135,
      z: -30000,
    },
    final: {
      top: 25,
      left: 75,
      rotateX: -1,
      rotateY: -2,
      rotateZ: 0,
      z: 0,
    },
  },
  'cube-6': {
    initial: {
      top: -35,
      left: 67.5,
      rotateX: -180,
      rotateY: -360,
      rotateZ: -180,
      z: -30000,
    },
    final: {
      top: 50,
      left: 85,
      rotateX: 0,
      rotateY: -3,
      rotateZ: 0,
      z: 0,
    },
  },
};

interface OrchestraCubesProps {
  className?: string;
}

export const OrchestraCubes: React.FC<OrchestraCubesProps> = ({ className = '' }) => {
  const stickyRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cubesContainerRef = useRef<HTMLDivElement>(null);
  const header1Ref = useRef<HTMLDivElement>(null);
  const header2Ref = useRef<HTMLDivElement>(null);
  const cubeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interpolate = (start: number, end: number, progress: number) => {
      return start + (end - start) * progress;
    };

    const stickyHeight = window.innerHeight * 4;

    // Create image assets for cube faces
    const cubeFaces = document.querySelectorAll('.orchestra-cube > div');
    let imageCounter = 1;

    cubeFaces.forEach((face) => {
      const img = document.createElement('img');
      img.src = `/api/placeholder/150/150`;
      img.alt = `Cube face image ${imageCounter}`;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      face.textContent = '';
      face.appendChild(img);
      imageCounter++;
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: stickyRef.current,
      start: 'top top',
      end: `+=${stickyHeight}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        if (
          !logoRef.current ||
          !cubesContainerRef.current ||
          !header1Ref.current ||
          !header2Ref.current
        )
          return;

        const initialProgress = Math.min(self.progress * 20, 1);
        logoRef.current.style.filter = `blur(${interpolate(0, 20, initialProgress)}px)`;

        const logoOpacityProgress =
          self.progress >= 0.02 ? Math.min((self.progress - 0.02) * 100, 1) : 0;
        logoRef.current.style.opacity = String(1 - logoOpacityProgress);

        const cubesOpacityProgress =
          self.progress >= 0.01 ? Math.min((self.progress - 0.01) * 100, 1) : 0;
        cubesContainerRef.current.style.opacity = String(cubesOpacityProgress);

        const header1Progress = Math.min(self.progress * 2.5, 1);
        header1Ref.current.style.transform = `translate(-50%, -50%) scale(${interpolate(
          1,
          1.5,
          header1Progress
        )})`;
        header1Ref.current.style.filter = `blur(${interpolate(0, 20, header1Progress)}px)`;
        header1Ref.current.style.opacity = String(1 - header1Progress);

        const header2StartProgress = (self.progress - 0.4) * 10;
        const header2Progress = Math.max(0, Math.min(header2StartProgress, 1));
        const header2Scale = interpolate(0.75, 1, header2Progress);
        const header2Blur = interpolate(10, 0, header2Progress);

        header2Ref.current.style.transform = `translate(-50%, -50%) scale(${header2Scale})`;
        header2Ref.current.style.filter = `blur(${header2Blur}px)`;
        header2Ref.current.style.opacity = String(header2Progress);

        const firstPhaseProgress = Math.min(self.progress * 2, 1);
        const secondPhaseProgress = self.progress >= 0.5 ? (self.progress - 0.5) * 2 : 0;

        Object.entries(cubesData).forEach(([cubeClass, data]) => {
          const cube = cubeRefs.current[cubeClass];
          if (!cube) return;

          const { initial, final } = data;

          const currentTop = interpolate(initial.top, final.top, firstPhaseProgress);
          const currentLeft = interpolate(initial.left, final.left, firstPhaseProgress);
          const currentRotateX = interpolate(initial.rotateX, final.rotateX, firstPhaseProgress);
          const currentRotateY = interpolate(initial.rotateY, final.rotateY, firstPhaseProgress);
          const currentRotateZ = interpolate(initial.rotateZ, final.rotateZ, firstPhaseProgress);
          const currentZ = interpolate(initial.z, final.z, firstPhaseProgress);

          let additionalRotation = 0;
          if (cubeClass === 'cube-2') {
            additionalRotation = interpolate(0, 180, secondPhaseProgress);
          } else if (cubeClass === 'cube-4') {
            additionalRotation = interpolate(0, -180, secondPhaseProgress);
          }

          cube.style.top = `${currentTop}%`;
          cube.style.left = `${currentLeft}%`;
          cube.style.transform = `
            translate3d(-50%, -50%, ${currentZ}px)
            rotateX(${currentRotateX}deg)
            rotateY(${currentRotateY + additionalRotation}deg)
            rotateZ(${currentRotateZ}deg)
          `;
        });
      },
    });

    return () => {
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const createCube = (cubeClass: string, data: CubeData) => {
    const { initial } = data;

    const cubeStyle: React.CSSProperties = {
      position: 'absolute',
      width: '150px',
      height: '150px',
      transformStyle: 'preserve-3d',
      top: `${initial.top}%`,
      left: `${initial.left}%`,
      transform: `translate3d(-50%, -50%, ${initial.z}px) rotateX(${initial.rotateX}deg) rotateY(${initial.rotateY}deg) rotateZ(${initial.rotateZ}deg)`,
    };

    const faceStyle: React.CSSProperties = {
      position: 'absolute',
      width: '150px',
      height: '150px',
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'visible',
    };

    return (
      <div
        key={cubeClass}
        ref={(el) => (cubeRefs.current[cubeClass] = el)}
        className={`orchestra-cube ${cubeClass}`}
        style={cubeStyle}
      >
        <div style={{ ...faceStyle, transform: 'translateZ(75px)' }} />
        <div style={{ ...faceStyle, transform: 'translateZ(-75px) rotateY(180deg)' }} />
        <div style={{ ...faceStyle, transform: 'translateX(75px) rotateY(90deg)' }} />
        <div
          style={{
            ...faceStyle,
            transform: 'translateX(-75px) rotateY(-90deg)',
          }}
        />
        <div
          style={{
            ...faceStyle,
            transform: 'translateY(-75px) rotateX(90deg)',
          }}
        />
        <div
          style={{
            ...faceStyle,
            transform: 'translateY(75px) rotateX(-90deg)',
          }}
        />
      </div>
    );
  };

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '600vh',
  };

  const stickyStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#331707',
    color: '#ffe9d9',
  };

  const logoStyle: React.CSSProperties = {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    gap: '24px',
    zIndex: 2,
  };

  const cubesStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    transformStyle: 'preserve-3d',
    perspective: '10000px',
    opacity: 0,
  };

  const header1Style: React.CSSProperties = {
    width: '60%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(1)',
    transformOrigin: 'center center',
    textAlign: 'center',
    color: '#ffe9d9',
  };

  const header2Style: React.CSSProperties = {
    width: '30%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0.75)',
    transformOrigin: 'center center',
    textAlign: 'center',
    opacity: 0,
    filter: 'blur(10px)',
    color: '#ffe9d9',
  };

  const aboutStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#cdb9ab',
    color: '#331707',
  };

  return (
    <div className={className} style={containerStyle}>
      <section ref={stickyRef} style={stickyStyle}>
        <div ref={logoRef} style={logoStyle}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                width: '35px',
                height: '35px',
                backgroundColor: '#ffe9d9',
                transform: 'rotate(42deg)',
                transformOrigin: 'bottom right',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: '26px',
            }}
          >
            <div
              style={{
                width: '35px',
                height: '35px',
                backgroundColor: '#ffe9d9',
              }}
            />
            <div
              style={{
                width: '35px',
                height: '35px',
                backgroundColor: '#ffe9d9',
              }}
            />
            <div
              style={{
                width: '35px',
                height: '35px',
                backgroundColor: '#ffe9d9',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                width: '35px',
                height: '35px',
                backgroundColor: '#ffe9d9',
                transform: 'rotate(-42deg)',
                transformOrigin: 'bottom left',
              }}
            />
          </div>
        </div>

        <div ref={cubesContainerRef} style={cubesStyle}>
          {Object.entries(cubesData).map(([cubeClass, data]) => createCube(cubeClass, data))}
        </div>

        <div ref={header1Ref} style={header1Style}>
          <h1 style={{ fontWeight: 400, fontSize: '4rem', lineHeight: 1 }}>
            Orchestra of 3D Cubes
          </h1>
        </div>

        <div ref={header2Ref} style={header2Style}>
          <h2 style={{ marginBottom: '0.5rem' }}>Scroll-Driven Animation</h2>
          <p style={{ fontSize: '1.25rem', fontWeight: 'lighter' }}>
            Watch the cubes emerge from the depths with smooth 3D transformations
          </p>
        </div>
      </section>

      <section style={aboutStyle}>
        <div>
          <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>About This Animation</h2>
          <p style={{ fontSize: '1.5rem', maxWidth: '800px' }}>
            This scroll-driven 3D animation demonstrates complex cube transformations using CSS 3D
            transforms and GSAP ScrollTrigger. Each cube follows its own animation path with precise
            timing and easing.
          </p>
        </div>
      </section>
    </div>
  );
};
