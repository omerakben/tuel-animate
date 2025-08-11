'use client';

import { TelescopeImageScroll } from '@tuel/gsap';

export default function TelescopeImageScrollPage() {
  return (
    <div className="w-full min-h-screen">
      <TelescopeImageScroll
        heroText="Explore the cosmos"
        outroText="Journey through space and time"
        bannerHeaderText="Telescope Image Scroll Demo"
        leftIntroText="Visual"
        rightIntroText="Discovery"
        className="bg-black text-white"
      />
    </div>
  );
}
