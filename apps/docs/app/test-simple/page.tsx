'use client';

import { 
  RevealOnScroll,
  InfiniteMarquee,
  AnimatedText,
  StickyCards,
  HeroSection,
  PageTransition,
  Carousel,
  AnimatedMenu,
  ImageGallery
} from '@tuel/components';

export default function SimpleTestPage() {
  const menuItems = [
    { id: '1', label: 'Home', href: '#' },
    { id: '2', label: 'About', href: '#' },
    { id: '3', label: 'Contact', href: '#' },
  ];

  const carouselSlides = [
    { 
      id: '1', 
      title: 'Slide 1', 
      description: 'First slide',
      content: <div className="p-8 bg-blue-500 rounded">Slide 1</div>
    },
    { 
      id: '2', 
      title: 'Slide 2', 
      description: 'Second slide',
      content: <div className="p-8 bg-purple-500 rounded">Slide 2</div>
    },
  ];

  const stickyCards = [
    { 
      id: '1', 
      content: <div className="p-8 text-white">Card 1</div>,
      backgroundColor: '#8b5cf6'
    },
    { 
      id: '2', 
      content: <div className="p-8 text-white">Card 2</div>,
      backgroundColor: '#3b82f6'
    },
  ];

  const galleryImages = [
    { id: '1', src: 'https://picsum.photos/400/300?random=1', alt: 'Image 1' },
    { id: '2', src: 'https://picsum.photos/400/300?random=2', alt: 'Image 2' },
    { id: '3', src: 'https://picsum.photos/400/300?random=3', alt: 'Image 3' },
    { id: '4', src: 'https://picsum.photos/400/300?random=4', alt: 'Image 4' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menu */}
      <AnimatedMenu items={menuItems} variant="slide" position="left" />

      {/* Hero Section */}
      <HeroSection
        title="Tuel Animate Test"
        subtitle="Testing Animation Components"
        backgroundImage="https://picsum.photos/1920/1080?random=hero"
        overlay={true}
        overlayOpacity={0.5}
      />

      {/* Text Animations */}
      <section className="py-20 px-8">
        <RevealOnScroll animation="fade-up">
          <AnimatedText
            text="Animated Text Demo"
            variant="split"
            className="text-4xl font-bold text-center mb-8"
          />
        </RevealOnScroll>

        <RevealOnScroll animation="fade-up" delay={0.2}>
          <AnimatedText
            text="This text uses the wave animation"
            variant="wave"
            className="text-2xl text-center text-gray-600"
          />
        </RevealOnScroll>
      </section>

      {/* Infinite Marquee */}
      <section className="py-10 bg-black">
        <InfiniteMarquee speed={50} pauseOnHover>
          <span className="text-white mx-8">React</span>
          <span className="text-white mx-8">TypeScript</span>
          <span className="text-white mx-8">GSAP</span>
          <span className="text-white mx-8">Framer Motion</span>
          <span className="text-white mx-8">Three.js</span>
        </InfiniteMarquee>
      </section>

      {/* Carousel */}
      <section className="py-20 px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Carousel Demo</h2>
        <div className="max-w-4xl mx-auto h-96">
          <Carousel
            slides={carouselSlides}
            variant="fade"
            autoPlay={true}
            autoPlayInterval={3000}
            showIndicators={true}
            showArrows={true}
          />
        </div>
      </section>

      {/* Sticky Cards */}
      <section className="min-h-screen">
        <StickyCards
          cards={stickyCards}
          variant="scale"
          spacing={100}
        />
      </section>

      {/* Image Gallery */}
      <section className="py-20 px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Gallery Demo</h2>
        <ImageGallery
          images={galleryImages}
          layout="grid"
          columns={2}
          gap={20}
          hoverEffect="zoom"
        />
      </section>

      {/* Reveal on Scroll Examples */}
      <section className="py-20 px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <RevealOnScroll animation="fade-up">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Card 1</h3>
              <p>This card fades up on scroll</p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="fade-up" delay={0.2}>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Card 2</h3>
              <p>This card has a delay</p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll animation="fade-up" delay={0.4}>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Card 3</h3>
              <p>This card has more delay</p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}