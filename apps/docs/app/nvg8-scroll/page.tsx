'use client';

import { NVG8Scroll } from '@tuel/gsap';

export default function NVG8ScrollPage() {
  return (
    <div className="w-full min-h-screen">
      <NVG8Scroll
        title="NVG8 Scroll Demo"
        subtitle="Advanced scroll-driven animations with dynamic icons"
        outroTitle="Experience Complete"
        className="bg-gray-900 text-white"
      />
    </div>
  );
}
