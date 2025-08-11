'use client';

import { OrchestraCubes } from '@tuel/components';

export default function OrchestraCubesPage() {
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
        header1="Orchestra 3D Animation"
        header2="Immersive scroll-driven 3D cube animations"
        subtitle="Experience sophisticated 3D cube animations that respond to scroll interactions. Built with GSAP and advanced transform calculations for smooth, performant visual storytelling."
        stickyHeight={4}
      />
    </div>
  );
}
