'use client';

import { KarimSaabScroll } from '@tuel/gsap';

export default function KarimSaabScrollPage() {
  return (
    <div className="w-full min-h-screen">
      <KarimSaabScroll
        title1="Karim Saab"
        title2="Scroll Animation"
        title3="Demo"
        className="bg-black text-white"
      />
    </div>
  );
}
