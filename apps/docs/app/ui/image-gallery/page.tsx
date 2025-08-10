'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

export default function ImageGalleryPage() {
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'carousel'>('grid');
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState(16);
  const [hoverEffect, setHoverEffect] = useState<'zoom' | 'fade' | 'slide' | 'none'>('zoom');
  const [animationType, setAnimationType] = useState<'fade' | 'slide' | 'scale'>('fade');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryRef = useRef<HTMLDivElement>(null);

  // Sample images data
  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      alt: 'Mountain landscape',
      title: 'Mountain Peak',
      category: 'Nature',
      height: 400,
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop',
      alt: 'Forest path',
      title: 'Forest Trail',
      category: 'Nature',
      height: 500,
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=500&fit=crop',
      alt: 'Ocean waves',
      title: 'Ocean Waves',
      category: 'Nature',
      height: 350,
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=800&h=700&fit=crop',
      alt: 'City skyline',
      title: 'Urban Skyline',
      category: 'Architecture',
      height: 450,
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
      alt: 'Desert landscape',
      title: 'Desert Dunes',
      category: 'Nature',
      height: 380,
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=900&fit=crop',
      alt: 'Bridge architecture',
      title: 'Modern Bridge',
      category: 'Architecture',
      height: 520,
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      alt: 'Snow mountain',
      title: 'Snow Peak',
      category: 'Nature',
      height: 300,
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
      alt: 'Lakeside view',
      title: 'Serene Lake',
      category: 'Nature',
      height: 420,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getHoverEffectClass = () => {
    switch (hoverEffect) {
      case 'zoom':
        return 'hover:scale-110';
      case 'fade':
        return 'hover:opacity-75';
      case 'slide':
        return 'hover:translate-y-2';
      default:
        return '';
    }
  };

  const renderGridLayout = () => (
    <div
      className="grid auto-rows-max transition-all duration-500"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => openLightbox(index)}
        >
          <img
            src={image.src}
            alt={image.alt}
            className={`w-full h-full object-cover transition-all duration-300 ${getHoverEffectClass()}`}
            style={{
              height: layout === 'masonry' ? `${image.height}px` : 'auto',
              aspectRatio: layout === 'grid' ? '4/3' : 'auto',
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
              <p className="text-sm opacity-75">{image.category}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCarouselLayout = () => (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={image.id}
              className="w-full flex-shrink-0 relative cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <img src={image.src} alt={image.alt} className="w-full h-96 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-xl font-semibold mb-1">{image.title}</h3>
                <p className="text-white/75 text-sm">{image.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
      >
        →
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          ← Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Image Gallery</h1>
          <p className="text-gray-300 text-lg">
            Multiple gallery layout options with animations, hover effects, and lightbox
            functionality.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-12 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Gallery Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Layout Type</label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value as 'grid' | 'masonry' | 'carousel')}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="grid">Grid Layout</option>
                <option value="masonry">Masonry Layout</option>
                <option value="carousel">Carousel Layout</option>
              </select>
            </div>

            {layout !== 'carousel' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Columns: {columns}</label>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    value={columns}
                    onChange={(e) => setColumns(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gap: {gap}px</label>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={gap}
                    onChange={(e) => setGap(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Hover Effect</label>
              <select
                value={hoverEffect}
                onChange={(e) => setHoverEffect(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="zoom">Zoom</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div ref={galleryRef} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {layout === 'grid' && 'Grid Gallery'}
            {layout === 'masonry' && 'Masonry Gallery'}
            {layout === 'carousel' && 'Carousel Gallery'}
          </h2>

          {layout === 'carousel' ? renderCarouselLayout() : renderGridLayout()}
        </div>

        {/* Implementation Code */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Implementation</h2>
          <div className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-300">
              {`import { ImageGallery } from '@tuel/components';

const galleryImages = [
  {
    src: "/image1.jpg",
    alt: "Description",
    title: "Image Title",
    category: "Category"
  },
  // ... more images
];

export default function MyGallery() {
  return (
    <ImageGallery
      images={galleryImages}
      layout="${layout}"
      columns={${columns}}
      gap={${gap}}
      hoverEffect="${hoverEffect}"
      lightbox={true}
      animationType="${animationType}"
    />
  );
}`}
            </pre>
          </div>
        </div>

        {/* Props Documentation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Props & Configuration</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Prop</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Default</th>
                  <th className="px-6 py-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">images</td>
                  <td className="px-6 py-3 text-sm">GalleryImage[]</td>
                  <td className="px-6 py-3 text-sm">required</td>
                  <td className="px-6 py-3 text-sm">Array of image objects</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">layout</td>
                  <td className="px-6 py-3 text-sm">'grid' | 'masonry' | 'carousel'</td>
                  <td className="px-6 py-3 text-sm">'grid'</td>
                  <td className="px-6 py-3 text-sm">Gallery layout type</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">columns</td>
                  <td className="px-6 py-3 text-sm">number</td>
                  <td className="px-6 py-3 text-sm">3</td>
                  <td className="px-6 py-3 text-sm">Number of columns (grid/masonry)</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">gap</td>
                  <td className="px-6 py-3 text-sm">number</td>
                  <td className="px-6 py-3 text-sm">16</td>
                  <td className="px-6 py-3 text-sm">Gap between images in pixels</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">hoverEffect</td>
                  <td className="px-6 py-3 text-sm">'zoom' | 'fade' | 'slide' | 'none'</td>
                  <td className="px-6 py-3 text-sm">'zoom'</td>
                  <td className="px-6 py-3 text-sm">Hover animation effect</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">lightbox</td>
                  <td className="px-6 py-3 text-sm">boolean</td>
                  <td className="px-6 py-3 text-sm">true</td>
                  <td className="px-6 py-3 text-sm">Enable lightbox modal</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">onImageClick</td>
                  <td className="px-6 py-3 text-sm">(image, index) =&gt; void</td>
                  <td className="px-6 py-3 text-sm">undefined</td>
                  <td className="px-6 py-3 text-sm">Callback when image is clicked</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🎨 Multiple Layouts</h3>
              <p className="text-gray-300 text-sm">
                Grid, masonry, and carousel layouts with smooth transitions between modes.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🔍 Lightbox Modal</h3>
              <p className="text-gray-300 text-sm">
                Full-screen image viewing with navigation and keyboard controls.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">✨ Hover Effects</h3>
              <p className="text-gray-300 text-sm">
                Multiple hover animations including zoom, fade, and slide effects.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">📱 Responsive</h3>
              <p className="text-gray-300 text-sm">
                Automatically adapts to different screen sizes and orientations.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">⚡ Performance</h3>
              <p className="text-gray-300 text-sm">
                Lazy loading, optimized rendering, and smooth 60fps animations.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">♿ Accessible</h3>
              <p className="text-gray-300 text-sm">
                Keyboard navigation, screen reader support, and ARIA labels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
          >
            ✕
          </button>

          <button
            onClick={prevLightboxImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 z-10"
          >
            ←
          </button>

          <button
            onClick={nextLightboxImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 z-10"
          >
            →
          </button>

          <div className="max-w-4xl max-h-[90vh] mx-4">
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
            <div className="text-center mt-4 text-white">
              <h3 className="text-xl font-semibold">{images[lightboxIndex].title}</h3>
              <p className="text-gray-300">{images[lightboxIndex].category}</p>
              <p className="text-sm text-gray-400 mt-2">
                {lightboxIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
