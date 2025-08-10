import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { cn } from '@tuel/utils';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Shaders
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uOffset;
  uniform vec2 uResolution;
  uniform vec4 uBorderColor;
  uniform vec4 uHoverColor;
  uniform vec4 uBackgroundColor;
  uniform vec2 uMousePos;
  uniform float uZoom;
  uniform float uCellSize;
  uniform float uTextureCount;
  uniform sampler2D uImageAtlas;
  uniform sampler2D uTextAtlas;
  varying vec2 vUv;

  void main() {
    vec2 screenUV = (vUv - 0.5) * 2.0;

    float radius = length(screenUV);
    float distortion = 1.0 - 0.08 * radius * radius;
    vec2 distortedUV = screenUV * distortion;

    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 worldCoord = distortedUV * aspectRatio;

    worldCoord *= uZoom;
    worldCoord += uOffset;

    vec2 cellPos = worldCoord / uCellSize;
    vec2 cellId = floor(cellPos);
    vec2 cellUV = fract(cellPos);

    vec2 mouseScreenUV = (uMousePos / uResolution) * 2.0 - 1.0;
    mouseScreenUV.y = -mouseScreenUV.y;

    float mouseRadius = length(mouseScreenUV);
    float mouseDistortion = 1.0 - 0.08 * mouseRadius * mouseRadius;
    vec2 mouseDistortedUV = mouseScreenUV * mouseDistortion;
    vec2 mouseWorldCoord = mouseDistortedUV * aspectRatio;

    mouseWorldCoord *= uZoom;
    mouseWorldCoord += uOffset;

    vec2 mouseCellPos = mouseWorldCoord / uCellSize;
    vec2 mouseCellId = floor(mouseCellPos);

    vec2 cellCenter = cellId + 0.5;
    vec2 mouseCellCenter = mouseCellId + 0.5;
    float cellDistance = length(cellCenter - mouseCellCenter);
    float hoverIntensity = 1.0 - smoothstep(0.4, 0.7, cellDistance);
    bool isHovered = hoverIntensity > 0.0 && uMousePos.x >= 0.0;

    vec3 backgroundColor = uBackgroundColor.rgb;
    if (isHovered) {
      backgroundColor = mix(uBackgroundColor.rgb, uHoverColor.rgb, hoverIntensity * uHoverColor.a);
    }

    float lineWidth = 0.005;
    float gridX = smoothstep(0.0, lineWidth, cellUV.x) * smoothstep(0.0, lineWidth, 1.0 - cellUV.x);
    float gridY = smoothstep(0.0, lineWidth, cellUV.y) * smoothstep(0.0, lineWidth, 1.0 - cellUV.y);
    float gridMask = gridX * gridY;

    float imageSize = 0.6;
    float imageBorder = (1.0 - imageSize) * 0.5;

    vec2 imageUV = (cellUV - imageBorder) / imageSize;

    float edgeSmooth = 0.01;
    vec2 imageMask = smoothstep(-edgeSmooth, edgeSmooth, imageUV) *
                    smoothstep(-edgeSmooth, edgeSmooth, 1.0 - imageUV);
    float imageAlpha = imageMask.x * imageMask.y;

    bool inImageArea = imageUV.x >= 0.0 && imageUV.x <= 1.0 && imageUV.y >= 0.0 && imageUV.y <= 1.0;

    float textHeight = 0.08;
    float textY = 0.88;

    bool inTextArea = cellUV.x >= 0.05 && cellUV.x <= 0.95 && cellUV.y >= textY && cellUV.y <= (textY + textHeight);

    float texIndex = mod(cellId.x + cellId.y * 3.0, uTextureCount);

    vec3 color = backgroundColor;

    if (inImageArea && imageAlpha > 0.0) {
      float atlasSize = ceil(sqrt(uTextureCount));
      vec2 atlasPos = vec2(mod(texIndex, atlasSize), floor(texIndex / atlasSize));
      vec2 atlasUV = (atlasPos + imageUV) / atlasSize;
      atlasUV.y = 1.0 - atlasUV.y;

      vec3 imageColor = texture2D(uImageAtlas, atlasUV).rgb;
      color = mix(color, imageColor, imageAlpha);
    }

    if (inTextArea) {
      vec2 textCoord = vec2((cellUV.x - 0.05) / 0.9, (cellUV.y - textY) / textHeight);
      textCoord.y = 1.0 - textCoord.y;

      float atlasSize = ceil(sqrt(uTextureCount));
      vec2 atlasPos = vec2(mod(texIndex, atlasSize), floor(texIndex / atlasSize));
      vec2 atlasUV = (atlasPos + textCoord) / atlasSize;

      vec4 textColor = texture2D(uTextAtlas, atlasUV);

      vec3 textBgColor = backgroundColor;
      color = mix(textBgColor, textColor.rgb, textColor.a);
    }

    vec3 borderRGB = uBorderColor.rgb;
    float borderAlpha = uBorderColor.a;
    color = mix(color, borderRGB, (1.0 - gridMask) * borderAlpha);

    float fade = 1.0 - smoothstep(1.2, 1.8, radius);

    gl_FragColor = vec4(color * fade, 1.0);
  }
`;

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  year?: number;
  href?: string;
}

export interface PhantomGalleryProps {
  items: GalleryItem[];
  className?: string;
  cellSize?: number;
  zoomLevel?: number;
  lerpFactor?: number;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  onItemClick?: (item: GalleryItem) => void;
}

function GalleryMesh({
  items,
  cellSize = 0.75,
  zoomLevel = 1.25,
  lerpFactor = 0.075,
  borderColor = 'rgba(255, 255, 255, 0.15)',
  backgroundColor = 'rgba(0, 0, 0, 1)',
  textColor = 'rgba(128, 128, 128, 1)',
  hoverColor = 'rgba(255, 255, 255, 0)',
  onItemClick,
}: Omit<PhantomGalleryProps, 'className'>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, mouse: _mouse, camera: _camera } = useThree();
  const [imageAtlas, setImageAtlas] = useState<THREE.Texture | null>(null);
  const [textAtlas, setTextAtlas] = useState<THREE.Texture | null>(null);

  const offsetRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1.0);
  const targetZoomRef = useRef(1.0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Create texture atlases
  useEffect(() => {
    const createTextTexture = (title: string, year?: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.clearRect(0, 0, 512, 64);
      ctx.font = '20px monospace';
      ctx.fillStyle = textColor;
      ctx.textBaseline = 'middle';

      ctx.textAlign = 'left';
      ctx.fillText(title.toUpperCase(), 8, 32);
      if (year) {
        ctx.textAlign = 'right';
        ctx.fillText(year.toString(), 504, 32);
      }

      return new THREE.CanvasTexture(canvas);
    };

    const createTextureAtlas = async (textures: THREE.Texture[], isText = false) => {
      const atlasSize = Math.ceil(Math.sqrt(textures.length));
      const textureSize = 512;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = atlasSize * textureSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      if (isText) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      textures.forEach((texture, index) => {
        const x = (index % atlasSize) * textureSize;
        const y = Math.floor(index / atlasSize) * textureSize;

        if (texture.image) {
          ctx.drawImage(texture.image, x, y, textureSize, textureSize);
        }
      });

      const atlasTexture = new THREE.CanvasTexture(canvas);
      atlasTexture.wrapS = THREE.ClampToEdgeWrapping;
      atlasTexture.wrapT = THREE.ClampToEdgeWrapping;
      atlasTexture.minFilter = THREE.LinearFilter;
      atlasTexture.magFilter = THREE.LinearFilter;
      atlasTexture.flipY = false;

      return atlasTexture;
    };

    const loadTextures = async () => {
      const textureLoader = new THREE.TextureLoader();
      const imageTextures: THREE.Texture[] = [];
      const textTextures: THREE.Texture[] = [];

      await Promise.all(
        items.map(async (item) => {
          const texture = await textureLoader.loadAsync(item.image);
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          imageTextures.push(texture);

          const textTexture = createTextTexture(item.title, item.year);
          if (textTexture) textTextures.push(textTexture);
        })
      );

      const imgAtlas = await createTextureAtlas(imageTextures, false);
      const txtAtlas = await createTextureAtlas(textTextures, true);

      if (imgAtlas) setImageAtlas(imgAtlas);
      if (txtAtlas) setTextAtlas(txtAtlas);
    };

    loadTextures();
  }, [items, textColor]);

  // Convert rgba color to vec4
  const rgbaToVec4 = (rgba: string) => {
    const match = rgba.match(/rgba?\(([^)]+)\)/);
    if (!match) return new THREE.Vector4(1, 1, 1, 1);
    const values = match[1]
      .split(',')
      .map((v, i) => (i < 3 ? parseFloat(v.trim()) / 255 : parseFloat(v.trim() || '1')));
    return new THREE.Vector4(...values);
  };

  // Handle mouse events
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      targetZoomRef.current = zoomLevel;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      targetOffsetRef.current.x -= deltaX * 0.003;
      targetOffsetRef.current.y += deltaY * 0.003;

      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDraggingRef.current && Math.abs(e.clientX - dragStartRef.current.x) < 5) {
        // Handle click
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        const cellX = Math.floor((x * zoomRef.current + offsetRef.current.x) / cellSize);
        const cellY = Math.floor((y * zoomRef.current + offsetRef.current.y) / cellSize);
        const texIndex = Math.floor((cellX + cellY * 3.0) % items.length);
        const actualIndex = texIndex < 0 ? items.length + texIndex : texIndex;

        if (items[actualIndex]) {
          onItemClick?.(items[actualIndex]);
        }
      }

      isDraggingRef.current = false;
      targetZoomRef.current = 1.0;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [items, cellSize, onItemClick]);

  // Update uniforms
  useFrame(({ mouse, size }) => {
    if (!materialRef.current) return;

    // Smooth offset and zoom
    offsetRef.current.x += (targetOffsetRef.current.x - offsetRef.current.x) * lerpFactor;
    offsetRef.current.y += (targetOffsetRef.current.y - offsetRef.current.y) * lerpFactor;
    zoomRef.current += (targetZoomRef.current - zoomRef.current) * lerpFactor;

    // Update uniforms
    materialRef.current.uniforms.uOffset.value.set(offsetRef.current.x, offsetRef.current.y);
    materialRef.current.uniforms.uZoom.value = zoomRef.current;
    materialRef.current.uniforms.uMousePos.value.set(
      ((mouse.x + 1) * size.width) / 2,
      ((1 - mouse.y) * size.height) / 2
    );
    materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  if (!imageAtlas || !textAtlas) return null;

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uOffset: { value: new THREE.Vector2(0, 0) },
          uResolution: { value: new THREE.Vector2(size.width, size.height) },
          uBorderColor: { value: rgbaToVec4(borderColor) },
          uHoverColor: { value: rgbaToVec4(hoverColor) },
          uBackgroundColor: { value: rgbaToVec4(backgroundColor) },
          uMousePos: { value: new THREE.Vector2(-1, -1) },
          uZoom: { value: 1.0 },
          uCellSize: { value: cellSize },
          uTextureCount: { value: items.length },
          uImageAtlas: { value: imageAtlas },
          uTextAtlas: { value: textAtlas },
        }}
      />
    </mesh>
  );
}

export function PhantomGallery({ items, className, ...props }: PhantomGalleryProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: props.backgroundColor || '#000' }}
      >
        <GalleryMesh items={items} {...props} />
      </Canvas>
    </div>
  );
}
