'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';

// Register GSAP plugins
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

interface CubeProps {
  cubeKey: string;
  images: string[];
  className?: string;
}

function Cube({ cubeKey, images, className = '' }: CubeProps) {
  const data = cubesData[cubeKey];

  return (
    <div
      className={`cube ${cubeKey} ${className} absolute w-[150px] h-[150px]`}
      data-initial-top={data.initial.top}
      data-initial-left={data.initial.left}
      data-initial-rotatex={data.initial.rotateX}
      data-initial-rotatey={data.initial.rotateY}
      data-initial-rotatez={data.initial.rotateZ}
      data-initial-z={data.initial.z}
    >
      <div className="cube-face cube-front absolute w-full h-full overflow-hidden">
        <img
          src={images[0] || '/placeholder.jpg'}
          alt={`${cubeKey} front`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="cube-face cube-back absolute w-full h-full overflow-hidden">
        <img
          src={images[1] || '/placeholder.jpg'}
          alt={`${cubeKey} back`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="cube-face cube-right absolute w-full h-full overflow-hidden">
        <img
          src={images[2] || '/placeholder.jpg'}
          alt={`${cubeKey} right`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="cube-face cube-left absolute w-full h-full overflow-hidden">
        <img
          src={images[3] || '/placeholder.jpg'}
          alt={`${cubeKey} left`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="cube-face cube-top absolute w-full h-full overflow-hidden">
        <img
          src={images[4] || '/placeholder.jpg'}
          alt={`${cubeKey} top`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="cube-face cube-bottom absolute w-full h-full overflow-hidden">
        <img
          src={images[5] || '/placeholder.jpg'}
          alt={`${cubeKey} bottom`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export interface OrchestraCubesProps {
  className?: string;
  header1?: string;
  header2?: string;
  subtitle?: string;
  images?: string[];
  stickyHeight?: number;
  backgroundColor?: string;
  textColor?: string;
}

export function OrchestraCubes({
  className = '',
  header1 = 'The first media company crafted for the digital first generation.',
  header2 = 'Where innovation meets precision.',
  subtitle = 'Symphonia unites visionary thinkers, creative architects, and analytical experts, collaborating seamlessly to transform challenges into opportunities. Together, we deliver tailored solutions that drive impact and inspire growth.',
  images = [
    '/images/img1.jpeg',
    '/images/img2.jpeg',
    '/images/img3.jpeg',
    '/images/img4.jpeg',
    '/images/img5.jpeg',
    '/images/img6.jpeg',
    '/images/img7.jpeg',
    '/images/img8.jpeg',
    '/images/img9.jpeg',
    '/images/img10.jpeg',
    '/images/img11.jpeg',
    '/images/img12.jpeg',
    '/images/img13.jpeg',
    '/images/img14.jpeg',
    '/images/img15.jpeg',
    '/images/img16.jpeg',
    '/images/img17.jpeg',
    '/images/img18.jpeg',
    '/images/img19.jpeg',
    '/images/img20.jpeg',
    '/images/img21.jpeg',
    '/images/img22.jpeg',
    '/images/img23.jpeg',
    '/images/img24.jpeg',
    '/images/img25.jpeg',
    '/images/img26.jpeg',
    '/images/img27.jpeg',
    '/images/img28.jpeg',
    '/images/img29.jpeg',
    '/images/img30.jpeg',
    '/images/img31.jpeg',
    '/images/img32.jpeg',
    '/images/img33.jpeg',
    '/images/img34.jpeg',
    '/images/img35.jpeg',
    '/images/img36.jpeg',
  ],
  stickyHeight = 4,
  backgroundColor = '#331707',
  textColor = '#ffe9d9',
}: OrchestraCubesProps) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cubesRef = useRef<HTMLDivElement>(null);
  const header1Ref = useRef<HTMLDivElement>(null);
  const header2Ref = useRef<HTMLDivElement>(null);
  const [cubeRefs] = useState(() =>
    Object.keys(cubesData).reduce(
      (acc, key) => {
        acc[key] = useRef<HTMLDivElement>(null);
        return acc;
      },
      {} as Record<string, React.RefObject<HTMLDivElement | null>>
    )
  );

  const interpolate = (start: number, end: number, progress: number) => {
    return start + (end - start) * progress;
  };

  useEffect(() => {
    if (!stickyRef.current) return;

    // Initialize cube positions with transforms
    Object.entries(cubesData).forEach(([cubeKey, data]) => {
      const cubeRef = cubeRefs[cubeKey];
      if (cubeRef.current) {
        const { initial } = data;
        cubeRef.current.style.top = `${initial.top}%`;
        cubeRef.current.style.left = `${initial.left}%`;
        cubeRef.current.style.transform = `
          translate3d(-50%, -50%, ${initial.z}px)
          rotateX(${initial.rotateX}deg)
          rotateY(${initial.rotateY}deg)
          rotateZ(${initial.rotateZ}deg)
        `;
      }
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: stickyRef.current,
      start: 'top top',
      end: `+=${window.innerHeight * stickyHeight}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const logo = logoRef.current;
        const cubesContainer = cubesRef.current;
        const header1 = header1Ref.current;
        const header2 = header2Ref.current;

        if (logo) {
          const initialProgress = Math.min(self.progress * 20, 1);
          logo.style.filter = `blur(${interpolate(0, 20, initialProgress)}px)`;

          const logoOpacityProgress =
            self.progress >= 0.02 ? Math.min((self.progress - 0.02) * 100, 1) : 0;
          logo.style.opacity = String(1 - logoOpacityProgress);
        }

        if (cubesContainer) {
          const cubesOpacityProgress =
            self.progress >= 0.01 ? Math.min((self.progress - 0.01) * 100, 1) : 0;
          cubesContainer.style.opacity = String(cubesOpacityProgress);
        }

        if (header1) {
          const header1Progress = Math.min(self.progress * 2.5, 1);
          header1.style.transform = `translate(-50%, -50%) scale(${interpolate(1, 1.5, header1Progress)})`;
          header1.style.filter = `blur(${interpolate(0, 20, header1Progress)}px)`;
          header1.style.opacity = String(1 - header1Progress);
        }

        if (header2) {
          const header2StartProgress = (self.progress - 0.4) * 10;
          const header2Progress = Math.max(0, Math.min(header2StartProgress, 1));
          const header2Scale = interpolate(0.75, 1, header2Progress);
          const header2Blur = interpolate(10, 0, header2Progress);

          header2.style.transform = `translate(-50%, -50%) scale(${header2Scale})`;
          header2.style.filter = `blur(${header2Blur}px)`;
          header2.style.opacity = String(header2Progress);
        }

        // Animate cubes
        const firstPhaseProgress = Math.min(self.progress * 2, 1);
        const secondPhaseProgress = self.progress >= 0.5 ? (self.progress - 0.5) * 2 : 0;

        Object.entries(cubesData).forEach(([cubeKey, data]) => {
          const cubeRef = cubeRefs[cubeKey];
          if (!cubeRef.current) return;

          const { initial, final } = data;

          const currentTop = interpolate(initial.top, final.top, firstPhaseProgress);
          const currentLeft = interpolate(initial.left, final.left, firstPhaseProgress);
          const currentRotateX = interpolate(initial.rotateX, final.rotateX, firstPhaseProgress);
          const currentRotateY = interpolate(initial.rotateY, final.rotateY, firstPhaseProgress);
          const currentRotateZ = interpolate(initial.rotateZ, final.rotateZ, firstPhaseProgress);
          const currentZ = interpolate(initial.z, final.z, firstPhaseProgress);

          let additionalRotation = 0;
          if (cubeKey === 'cube-2') {
            additionalRotation = interpolate(0, 180, secondPhaseProgress);
          } else if (cubeKey === 'cube-4') {
            additionalRotation = interpolate(0, -180, secondPhaseProgress);
          }

          cubeRef.current.style.top = `${currentTop}%`;
          cubeRef.current.style.left = `${currentLeft}%`;
          cubeRef.current.style.transform = `
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
    };
  }, [stickyHeight, cubeRefs]);

  const cubeImages = Object.keys(cubesData).map((_, index) =>
    images.slice(index * 6, (index + 1) * 6)
  );

  return (
    <>
      <div
        ref={stickyRef}
        className={`orchestra-cubes relative w-full h-screen overflow-hidden ${className}`}
        data-bg={backgroundColor}
        data-color={textColor}
      >
        {/* Logo */}
        <div
          ref={logoRef}
          className="absolute top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-6 z-20"
        >
          <div className="flex flex-col gap-2">
            <div className="w-4 h-4 bg-[#ffe9d9]" />
            <div className="w-4 h-4 bg-[#ffe9d9]" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-4 h-4 bg-[#ffe9d9]" />
            <div className="w-4 h-4 bg-[#ffe9d9]" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-4 h-4 bg-[#ffe9d9]" />
            <div className="w-4 h-4 bg-[#ffe9d9]" />
          </div>
        </div>

        <div ref={cubesRef} className="cubes-container opacity-0">
          {Object.keys(cubesData).map((cubeKey, index) => (
            <div key={cubeKey} ref={cubeRefs[cubeKey]}>
              <Cube cubeKey={cubeKey} images={cubeImages[index]} />
            </div>
          ))}
        </div>

        <div
          ref={header1Ref}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 max-w-4xl px-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#ffe9d9]">{header1}</h1>
        </div>

        <div
          ref={header2Ref}
          className="header-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 max-w-2xl px-8 opacity-0"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#ffe9d9]">{header2}</h2>
          <p className="text-lg md:text-xl leading-relaxed text-[#ffe9d9]">{subtitle}</p>
        </div>
      </div>

      <section className="relative w-full h-screen flex justify-center items-center text-center bg-[#cdb9ab] text-[#331707]">
        <h2 className="text-3xl md:text-5xl font-bold">Your next section goes here</h2>
      </section>
    </>
  );
}
