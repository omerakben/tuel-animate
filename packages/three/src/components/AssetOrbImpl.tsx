'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './AssetOrb.css';

export interface AssetOrbProps {
  /**
   * Total number of different images to randomly select from
   * @default 30
   */
  totalImages?: number;

  /**
   * Total number of image planes to display on the sphere
   * @default 100
   */
  totalItems?: number;

  /**
   * Base width for image planes
   * @default 1
   */
  baseWidth?: number;

  /**
   * Base height for image planes
   * @default 0.6
   */
  baseHeight?: number;

  /**
   * Radius of the sphere on which images are positioned
   * @default 5
   */
  sphereRadius?: number;

  /**
   * Background color of the scene (hex without #)
   * @default "3b3b3b"
   */
  backgroundColor?: string;

  /**
   * CSS class name for the container
   * @default ""
   */
  className?: string;

  /**
   * Custom function to generate image paths
   * @param index - Random index between 1 and totalImages
   * @returns Image path
   */
  getImagePath?: (index: number) => string;
}

const AssetOrbImpl = ({
  totalImages = 30,
  totalItems = 100,
  baseWidth = 1,
  baseHeight = 0.6,
  sphereRadius = 5,
  backgroundColor = '3b3b3b',
  className = '',
  getImagePath,
}: AssetOrbProps) => {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orbRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(parseInt(backgroundColor, 16));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    orbRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 1.2;
    controls.minDistance = 6;
    controls.maxDistance = 10;
    controls.enableZoom = true;
    controls.enablePan = false;

    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;

    const getRandomImagePath = () => {
      const index = Math.floor(Math.random() * totalImages) + 1;
      if (getImagePath) {
        return getImagePath(index);
      }
      // Use placeholder API as default
      return `/api/placeholder/400/300?seed=${index}`;
    };

    const createImagePlane = (texture: THREE.Texture) => {
      const imageAspect = texture.image.width / texture.image.height;
      let width = baseWidth;
      let height = baseHeight;

      if (imageAspect > 1) {
        height = width / imageAspect;
      } else {
        width = height * imageAspect;
      }

      return new THREE.PlaneGeometry(width, height);
    };

    const loadImageMesh = (phi: number, theta: number) => {
      textureLoader.load(
        getRandomImagePath(),
        (texture) => {
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const geometry = createImagePlane(texture);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: false,
            depthWrite: true,
            depthTest: true,
          });

          const mesh = new THREE.Mesh(geometry, material);

          mesh.position.x = sphereRadius * Math.cos(theta) * Math.sin(phi);
          mesh.position.y = sphereRadius * Math.sin(theta) * Math.sin(phi);
          mesh.position.z = sphereRadius * Math.cos(phi);

          mesh.lookAt(0, 0, 0);
          mesh.rotateY(Math.PI);

          scene.add(mesh);

          loadedCount++;
          if (loadedCount === totalItems) {
            animate();
          }
        },
        undefined,
        (error) => console.error('Error loading texture:', error)
      );
    };

    const createSphere = () => {
      for (let i = 0; i < totalItems; i++) {
        const phi = Math.acos(-1 + (2 * i) / totalItems);
        const theta = Math.sqrt(totalItems * Math.PI) * phi;
        loadImageMesh(phi, theta);
      }
    };

    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    createSphere();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (orbRef.current && renderer.domElement.parentNode) {
        orbRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [totalImages, totalItems, baseWidth, baseHeight, sphereRadius, backgroundColor, getImagePath]);

  return <div ref={orbRef} className={`orb ${className}`} />;
};

export { AssetOrbImpl };
