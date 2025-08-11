'use client';

import { RadgaHorizontalScroll } from '@tuel/components/scroll';

const radgaSlides = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    title: 'Refined Reception',
    subtitle: 'Lasting Impact',
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
    title: 'Practical Luxury',
    subtitle: 'Smart Living',
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?w=800&h=600&fit=crop',
    title: 'Modern Concrete',
    subtitle: 'Warm Details',
  },
  {
    id: 'slide-4',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    title: 'Curved Elements',
    subtitle: 'Modern Flow',
  },
  {
    id: 'slide-5',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    title: 'Minimal Design',
    subtitle: 'Natural Light',
  },
];

export default function RadgaHorizontalScrollPage() {
  return (
    <div className="min-h-screen">
      <RadgaHorizontalScroll
        slides={radgaSlides}
        stickyHeight={6}
        backgroundColor="#b4aea7"
        outroTitle="Shaping timeless spaces with contemporary vision"
        outroBackgroundColor="#141414"
      />
    </div>
  );
}
