import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';
import { useMemo } from 'react';

export function useAssetLoader(url: string, type: 'gltf' | 'texture' = 'texture') {
  const asset = useMemo(() => {
    if (type === 'gltf') {
      return useLoader(GLTFLoader, url);
    }
    return useLoader(TextureLoader, url);
  }, [url, type]);
  
  return asset;
}