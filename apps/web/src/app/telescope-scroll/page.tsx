'use client';

import { TelescopeScroll } from '@tuel/gsap';

export default function TelescopeScrollDemo() {
  const customSpotlightItems = [
    {
      name: 'Silent Arc',
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    },
    {
      name: 'Bloom24',
      img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
    },
    {
      name: 'Glass Fade',
      img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    },
    {
      name: 'Echo 9',
      img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    },
    {
      name: 'Velvet Loop',
      img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
    },
    {
      name: 'Field Two',
      img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop',
    },
    {
      name: 'Pale Thread',
      img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    },
    {
      name: 'Stillroom',
      img: 'https://images.unsplash.com/photo-1482189349482-3defd547e0e9?w=400&h=300&fit=crop',
    },
    {
      name: 'Ghostline',
      img: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop',
    },
    {
      name: 'Mono 73',
      img: 'https://images.unsplash.com/photo-1433477155337-9aea4e790195?w=400&h=300&fit=crop',
    },
  ];

  return (
    <div>
      <TelescopeScroll
        spotlightItems={customSpotlightItems}
        introText="Experience a journey through stunning visuals"
        outroText="Discover the beauty in motion"
        spotlightHeaderText="Visual storytelling through scroll"
        config={{
          gap: 0.08,
          speed: 0.3,
          arcRadius: 500,
        }}
      />
    </div>
  );
}
