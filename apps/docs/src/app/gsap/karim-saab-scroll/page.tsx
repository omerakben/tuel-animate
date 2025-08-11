import { KarimSaabScroll } from '@tuel/gsap';

export default function KarimSaabScrollPage() {
  return (
    <div>
      <KarimSaabScroll
        title1="Awaken the Scroll"
        title2="Where Frames Fade Into Fate"
        title3="The Last Frame Hits Hard"
        logoSrc="🎬"
        images={[
          {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=560&fit=crop',
            alt: 'Mountain landscape',
          },
          {
            src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=560&fit=crop',
            alt: 'Forest path',
          },
          {
            src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=560&fit=crop',
            alt: 'Ocean waves',
          },
          {
            src: 'https://images.unsplash.com/photo-1515041219749-89347f83291a?w=400&h=560&fit=crop',
            alt: 'Desert dunes',
          },
          {
            src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=560&fit=crop',
            alt: 'City skyline',
          },
          {
            src: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=560&fit=crop',
            alt: 'Mountain peak',
          },
          {
            src: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=560&fit=crop',
            alt: 'Lake reflection',
          },
          {
            src: 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=400&h=560&fit=crop',
            alt: 'Sunset sky',
          },
          {
            src: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=400&h=560&fit=crop',
            alt: 'Rock formation',
          },
        ]}
        spotlightImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop"
      />
    </div>
  );
}
