'use client';

import { CylindricalGallery } from '@tuel/components';

const galleryImages = [
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1534996858221-380b92700493?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1520637836862-4d197d17c30a?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop',
];

export default function CylindricalGalleryPage() {
  return (
    <div className="min-h-screen">
      <CylindricalGallery className="w-full h-screen fixed inset-0" images={galleryImages} />
    </div>
  );
}
