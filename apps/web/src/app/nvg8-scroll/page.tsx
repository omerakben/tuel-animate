import { NVG8Scroll } from '@tuel-animate/gsap';

export default function NVG8ScrollDemo() {
  const customIcons = [
    { id: 1, src: 'https://via.placeholder.com/60x60/333333/ffffff?text=🎨', alt: 'Design Icon' },
    { id: 2, src: 'https://via.placeholder.com/60x60/333333/ffffff?text=💻', alt: 'Code Icon' },
    { id: 3, src: 'https://via.placeholder.com/60x60/333333/ffffff?text=🚀', alt: 'Launch Icon' },
    { id: 4, src: 'https://via.placeholder.com/60x60/333333/ffffff?text=⚡', alt: 'Speed Icon' },
    { id: 5, src: 'https://via.placeholder.com/60x60/333333/ffffff?text=🎯', alt: 'Target Icon' },
  ];

  const customTextSegments = [
    { text: 'Explore creative coding', hasPlaceholder: true },
    { text: 'with clean animations.' },
    { text: 'Build responsive', hasPlaceholder: true },
    { text: 'user experiences.' },
    { text: 'Deploy modern', hasPlaceholder: true },
    { text: 'web applications.' },
  ];

  return (
    <div>
      <NVG8Scroll
        title="NVG8 Creative Studio"
        subtitle="Digital Innovation & Design"
        icons={customIcons}
        textSegments={customTextSegments}
        outroTitle="Navigate Forward"
      />
    </div>
  );
}
