'use client';

import { ThreeSlider } from '@tuel/components';

const slides = [
  {
    id: 1,
    title: 'Field Unit',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Astral Convergence',
    image: 'https://images.unsplash.com/photo-1534996858221-380b92700493?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Eclipse Core',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    title: 'Luminous',
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c30a?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    title: 'Serenity',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
  },
  {
    id: 6,
    title: 'Nebula Point',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  },
  {
    id: 7,
    title: 'Horizon',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
  },
];

export default function ThreeSliderPage() {
  return (
    <div className="min-h-screen">
      <ThreeSlider className="w-full h-screen fixed inset-0" slides={slides} />
    </div>
  );
}
