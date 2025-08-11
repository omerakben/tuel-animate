'use client';

import { MatVoyceScroll } from '@tuel/gsap';

export default function MatVoyceScrollDemo() {
  const customTitles = [
    { text: 'Creative Vision' },
    { text: 'Digital Craft' },
    { text: 'Brand Stories' },
    { text: 'Motion Design' },
    { text: 'Visual Impact' },
    { text: 'Studio Flow' },
  ];

  const customCardImages = [
    '/api/placeholder/400/600',
    '/api/placeholder/400/600',
    '/api/placeholder/400/600',
    '/api/placeholder/400/600',
    '/api/placeholder/400/600',
    '/api/placeholder/400/600',
    '/api/placeholder/400/600',
    '/api/placeholder/400/600',
  ];

  return (
    <main className="min-h-screen">
      <MatVoyceScroll
        logo="/api/placeholder/120/40"
        taglineMain="Premier creative studio for"
        taglineSecondary="exceptional digital experiences."
        aboutMain="Based in New York"
        aboutSecondary="Working globally"
        heroTitle="(Dare to scroll)"
        titles={customTitles}
        cardImages={customCardImages}
        outroTitle="Keep exploring"
      />
    </main>
  );
}
