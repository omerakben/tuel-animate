'use client';

import { OrchestraCubes } from '@tuel/components';

export default function OrchestraCubesDemo() {
  return (
    <div className="w-full min-h-screen">
      <style jsx global>{`
        .orchestra-cubes {
          background-color: #331707;
          color: #ffe9d9;
          perspective: 1000px;
        }

        .cube {
          transform-style: preserve-3d;
        }

        .cube-face.cube-front {
          transform: translateZ(75px);
        }

        .cube-face.cube-back {
          transform: translateZ(-75px) rotateY(180deg);
        }

        .cube-face.cube-right {
          transform: translateX(75px) rotateY(90deg);
        }

        .cube-face.cube-left {
          transform: translateX(-75px) rotateY(-90deg);
        }

        .cube-face.cube-top {
          transform: translateY(-75px) rotateX(90deg);
        }

        .cube-face.cube-bottom {
          transform: translateY(75px) rotateX(-90deg);
        }

        .cubes-container {
          transform-style: preserve-3d;
        }

        .header-2 {
          transform: translate(-50%, -50%) scale(0.75);
          filter: blur(10px);
        }
      `}</style>

      <OrchestraCubes
        header1="The first media company crafted for the digital first generation."
        header2="Where innovation meets precision."
        subtitle="Symphonia unites visionary thinkers, creative architects, and analytical experts, collaborating seamlessly to transform challenges into opportunities. Together, we deliver tailored solutions that drive impact and inspire growth."
        stickyHeight={4}
      />
    </div>
  );
}
