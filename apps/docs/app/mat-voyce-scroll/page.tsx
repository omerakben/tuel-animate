'use client';

import { MatVoyceScroll } from '@tuel/gsap';

export default function MatVoyceScrollPage() {
  return (
    <div className="w-full min-h-screen">
      <MatVoyceScroll
        heroTitle="Mat Voyce Scroll Demo"
        taglineMain="Interactive scroll-driven storytelling"
        taglineSecondary="Experience smooth animations that respond to your scroll"
        aboutMain="This demo showcases advanced scroll-triggered animations using GSAP and ScrollTrigger"
        aboutSecondary="Built with TypeScript, React, and sophisticated animation techniques"
        outroTitle="The End"
        className="bg-gray-900 text-white"
      />
    </div>
  );
}
