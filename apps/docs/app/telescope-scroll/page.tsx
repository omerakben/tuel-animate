'use client';

import { TelescopeScroll } from '@tuel/gsap';

export default function TelescopeScrollPage() {
  return (
    <div className="w-full min-h-screen">
      <TelescopeScroll
        introText="Discover the cosmos through immersive scroll animations"
        outroText="Journey completed"
        spotlightHeaderText="Telescope Scroll Demo"
        className="bg-black text-white"
      />
    </div>
  );
}
