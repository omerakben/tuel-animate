'use client';

import { VideoGallery } from '@tuel/components';

export default function VideoGalleryDemo() {
  return (
    <div className="w-full h-screen">
      <VideoGallery
        title="Framecast"
        nav="Frames 2024"
        config={{
          rows: 7,
          columns: 7,
          spacing: 10,
          curvature: 5,
          imageWidth: 7,
          imageHeight: 4.5,
        }}
      />
    </div>
  );
}
