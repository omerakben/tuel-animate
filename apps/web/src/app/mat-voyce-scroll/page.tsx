import { MatVoyceScroll } from '@tuel-animate/gsap';

export default function MatVoyceScrollDemo() {
  const customTitles = [
    { text: 'Design Studio' },
    { text: 'Brand Identity' },
    { text: 'Motion Graphics' },
    { text: 'Web Development' },
    { text: 'Art Direction' },
    { text: 'Creative Lab' },
    { text: 'Digital Agency' },
    { text: 'Visual Stories' },
  ];

  const customImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
  ];

  return (
    <div>
      <MatVoyceScroll
        heroTitle="(Scroll to experience)"
        taglineMain="Creative powerhouse for"
        taglineSecondary="design, animation, and digital experiences."
        aboutMain="Based in Toronto"
        aboutSecondary="Working globally"
        titles={customTitles}
        cardImages={customImages}
        outroTitle="Mat Voyce Style"
      />
    </div>
  );
}
