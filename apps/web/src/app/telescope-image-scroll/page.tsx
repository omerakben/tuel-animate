import { TelescopeImageScroll } from '@tuel-animate/gsap';

export default function TelescopeImageScrollDemo() {
  return (
    <div>
      <TelescopeImageScroll
        heroText="The frame is only the beginning."
        outroText="And that's the silhouette."
        bannerHeaderText="The Season Wears Confidence"
        leftIntroText="Surface"
        rightIntroText="Layered"
        bannerImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
        maskLayers={6}
      />
    </div>
  );
}
