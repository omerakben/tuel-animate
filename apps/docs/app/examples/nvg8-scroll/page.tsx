'use client';

import { NVG8Scroll } from '@tuel/gsap';

export default function NVG8ScrollDemo() {
  const customIcons = [
    { id: 1, src: '/api/placeholder/60/60', alt: 'Design Icon' },
    { id: 2, src: '/api/placeholder/60/60', alt: 'Code Icon' },
    { id: 3, src: '/api/placeholder/60/60', alt: 'Deploy Icon' },
    { id: 4, src: '/api/placeholder/60/60', alt: 'Analytics Icon' },
    { id: 5, src: '/api/placeholder/60/60', alt: 'Optimize Icon' },
  ];

  const customTextSegments = [
    { text: 'Build amazing', hasPlaceholder: true },
    { text: 'web experiences.' },
    { text: 'Access premium ', hasPlaceholder: true },
    { text: 'design tutorials', hasPlaceholder: true },
    { text: 'and learn from', hasPlaceholder: true },
    { text: 'industry experts.' },
  ];

  return (
    <main className="min-h-screen">
      <NVG8Scroll
        title="Design Pro"
        subtitle="Premium tutorials for modern developers."
        icons={customIcons}
        textSegments={customTextSegments}
        outroTitle="Start learning today"
      />
    </main>
  );
}
