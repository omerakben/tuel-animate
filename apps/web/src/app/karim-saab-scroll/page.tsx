import { KarimSaabScroll } from '@tuel-animate/gsap';

export default function KarimSaabScrollDemo() {
  const customImages = [
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=560&fit=crop',
      alt: 'Portfolio Image 1',
    },
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=560&fit=crop',
      alt: 'Portfolio Image 2',
    },
    {
      src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=560&fit=crop',
      alt: 'Portfolio Image 3',
    },
    {
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=560&fit=crop',
      alt: 'Portfolio Image 4',
    },
    {
      src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=560&fit=crop',
      alt: 'Portfolio Image 5',
    },
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=560&fit=crop',
      alt: 'Portfolio Image 6',
    },
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=560&fit=crop',
      alt: 'Portfolio Image 7',
    },
    {
      src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=560&fit=crop',
      alt: 'Portfolio Image 8',
    },
    {
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=560&fit=crop',
      alt: 'Portfolio Image 9',
    },
  ];

  return (
    <div>
      <KarimSaabScroll
        images={customImages}
        spotlightImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
        title1="Karim Saab"
        title2="Creative Director"
        title3="& Visual Artist"
        logoSrc="/api/placeholder/120/40"
      />
    </div>
  );
}
