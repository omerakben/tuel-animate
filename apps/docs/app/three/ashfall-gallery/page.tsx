'use client';

import { AshfallGallery } from '@tuel/components';

export default function AshfallGalleryPage() {
  return (
    <div className="w-full min-h-screen bg-black">
      <AshfallGallery
        className="w-full h-screen"
        numVerticalSections={15}
        blocksPerSection={6}
        verticalSpacing={4}
        radius={7}
        autoRotate={true}
        baseRotationSpeed={0.002}
        scrollSensitivity={0.008}
        blockWidth={2.2}
        blockHeight={1.5}
      />
    </div>
  );
}
