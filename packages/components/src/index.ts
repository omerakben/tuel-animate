// Original components
export { RevealOnScroll } from './reveal-on-scroll/RevealOnScroll';
export type { RevealOnScrollProps } from './reveal-on-scroll/RevealOnScroll';

export { InfiniteMarquee } from './infinite-marquee/InfiniteMarquee';
export type { InfiniteMarqueeProps } from './infinite-marquee/InfiniteMarquee';

// TEMPORARILY DISABLED - Three.js React 19 compatibility issue
// export { ThreeOrbitScene, ExampleOrbitBox } from './three-orbit-scene/ThreeOrbitScene';
// export type { ThreeOrbitSceneProps } from './three-orbit-scene/ThreeOrbitScene';

// 3D/WebGL components - RE-ENABLED AFTER FIXES
export { FloatingObjects } from './three/FloatingObjects';
export type { FloatingObjectProps, FloatingObjectsProps } from './three/FloatingObjects';

export { ParticleWave } from './three/ParticleWave';
export type { ParticleWaveProps } from './three/ParticleWave';

// NEW COMPONENTS - Phase 2 Implementation
export { ThreeGLTFScene } from './three/ThreeGLTFScene';
export type { ThreeGLTFSceneProps } from './three/ThreeGLTFScene';

export { GarageScene } from './three/GarageScene';
export type { GarageSceneProps } from './three/GarageScene';

export { ThreeSlider } from './three/ThreeSlider';
export type { ThreeSliderProps } from './three/ThreeSlider';

export { CylindricalGallery } from './three/CylindricalGallery';
export type { CylindricalGalleryProps } from './three/CylindricalGallery';

export { VideoGallery } from './three/VideoGallery';
export type { VideoGalleryProps } from './three/VideoGallery';

export { CielroseSlider } from './three/CielroseSlider';
export type { CielroseSliderProps, Slide } from './three/CielroseSlider';

export { AshfallGallery } from './three/AshfallGallery';
export type { AshfallGalleryProps } from './three/AshfallGallery';

export { OrchestraCubes } from './scroll/OrchestraCubes';
export type { OrchestraCubesProps } from './scroll/OrchestraCubes';

export { HorizontalScroll, HorizontalScrollItem } from './scroll/HorizontalScroll';
export type { HorizontalScrollItemProps, HorizontalScrollProps } from './scroll/HorizontalScroll';

export { TextExplosion } from './text-effects/TextExplosion';
export type { TextExplosionProps } from './text-effects/TextExplosion';

export {
  useViewTransition,
  ViewPageTransition,
  ViewTransition,
} from './transitions/ViewTransition';
export type { ViewPageTransitionProps, ViewTransitionProps } from './transitions/ViewTransition';

// Scroll components
export { ScrollFrameAnimation } from './scroll/ScrollFrameAnimation';
export type { ScrollFrameAnimationProps } from './scroll/ScrollFrameAnimation';

export { ParallaxContainer, ParallaxLayer, ParallaxScroll } from './scroll/ParallaxScroll';
export type {
  ParallaxContainerProps,
  ParallaxLayerProps,
  ParallaxScrollProps,
} from './scroll/ParallaxScroll';

export { ScrollMinimap } from './scroll/ScrollMinimap';
export type { ScrollMinimapProps } from './scroll/ScrollMinimap';

// Sticky cards
export { StickyCards } from './sticky-cards/StickyCards';
export type { StickyCard, StickyCardsProps } from './sticky-cards/StickyCards';

// Gallery
export { ImageGallery } from './gallery/ImageGallery';
export type { GalleryImage, ImageGalleryProps } from './gallery/ImageGallery';

// Menus
export { AnimatedMenu } from './menus/AnimatedMenu';
export type { AnimatedMenuProps, MenuItem } from './menus/AnimatedMenu';

// Text effects - TEMPORARILY DISABLED - Complex TypeScript issues
// export { AnimatedText } from './text-effects/AnimatedText';
// export type { AnimatedTextProps } from './text-effects/AnimatedText';

// Landing pages
export { HeroSection } from './landing-pages/HeroSection';
export type { HeroSectionProps } from './landing-pages/HeroSection';

export { OverlayReveal, PageReveal } from './landing-pages/PageReveal';
export type { OverlayRevealProps, PageRevealProps } from './landing-pages/PageReveal';

// Carousels
export { Carousel } from './carousels/Carousel';
export type { CarouselProps, CarouselSlide } from './carousels/Carousel';

// Page transitions
export { PageTransition } from './page-transitions/PageTransition';
export type { PageTransitionProps } from './page-transitions/PageTransition';

export { RouteTransition } from './page-transitions/RouteTransition';
export type { RouteTransitionProps } from './page-transitions/RouteTransition';

export { SmoothScroll } from './page-transitions/SmoothScroll';
export type { SmoothScrollProps } from './page-transitions/SmoothScroll';

export { ImageTrail } from './page-transitions/ImageTrail';
export type { ImageTrailProps } from './page-transitions/ImageTrail';

// Particles
export { ParticleField } from './particles/ParticleField';
export type { Particle, ParticleFieldProps } from './particles/ParticleField';

export { ParticleText } from './particles/ParticleText';
export type { ParticleTextProps } from './particles/ParticleText';

// Canvas animations
export { CanvasAnimation } from './canvas/CanvasAnimation';
export type { CanvasAnimationProps } from './canvas/CanvasAnimation';

export { WaveCanvas } from './canvas/WaveCanvas';
export type { Wave, WaveCanvasProps } from './canvas/WaveCanvas';

// export { NoiseField } from './canvas/NoiseField';
// export type { NoiseFieldProps } from './canvas/NoiseField';

// 3D/WebGL components - COMMENTED OUT
// export { PhantomGallery } from './three/PhantomGallery';
// export type { GalleryItem, PhantomGalleryProps } from './three/PhantomGallery';

// export { FloatingObjects } from './three/FloatingObjects';
// export type { FloatingObjectProps, FloatingObjectsProps } from './three/FloatingObjects';

// export { ParticleWave } from './three/ParticleWave';
// export type { ParticleWaveProps } from './three/ParticleWave';

// export { MorphingShapes } from './three/MorphingShapes';
// export type { MorphingShapesProps } from './three/MorphingShapes';

// Hover effects
export { HoverDistortion } from './hover/HoverDistortion';
export type { HoverDistortionProps } from './hover/HoverDistortion';
