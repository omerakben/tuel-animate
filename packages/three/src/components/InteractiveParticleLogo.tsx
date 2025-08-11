'use client';

import { useEffect, useRef } from 'react';
import './InteractiveParticleLogo.css';

export interface InteractiveParticleLogoProps {
  /** Path to the logo image */
  logoPath?: string;
  /** Size of the logo in pixels */
  logoSize?: number;
  /** Logo color tint as hex string */
  logoColor?: string;
  /** Canvas background color as hex string */
  canvasBg?: string;
  /** Radius of mouse distortion effect */
  distortionRadius?: number;
  /** Strength of the force applied to particles */
  forceStrength?: number;
  /** Maximum displacement distance for particles */
  maxDisplacement?: number;
  /** Force that pulls particles back to their original position */
  returnForce?: number;
  /** Additional CSS class for styling */
  className?: string;
}

export const InteractiveParticleLogo: React.FC<InteractiveParticleLogoProps> = ({
  logoPath = '/logo.png',
  logoSize = 1100,
  logoColor = '#999999',
  canvasBg = '#1a1a1a',
  distortionRadius = 3000,
  forceStrength = 0.003,
  maxDisplacement = 100,
  returnForce = 0.025,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const geometryRef = useRef<{
    positionBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;
    vertexCount: number;
  } | null>(null);
  const particleGridRef = useRef<
    Array<{
      ox: number;
      oy: number;
      vx: number;
      vy: number;
    }>
  >([]);
  const posArrayRef = useRef<Float32Array | null>(null);
  const colorArrayRef = useRef<Float32Array | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const execCountRef = useRef(0);
  const isCleanedUpRef = useRef(false);
  const isMobileRef = useRef(false);

  const CONFIG = {
    logoSize,
    logoColor,
    canvasBg,
    distortionRadius,
    forceStrength,
    maxDisplacement,
    returnForce,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const checkMobile = () => window.innerWidth < 1000;
    isMobileRef.current = checkMobile();

    if (isMobileRef.current) {
      return;
    }

    isCleanedUpRef.current = false;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    const gl = canvas.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function hexToRgb(hex: string): { r: number; g: number; b: number } {
      const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
          }
        : { r: 1, g: 1, b: 1 };
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec4 a_color;

      uniform vec2 u_resolution;

      varying vec4 v_color;

      void main() {
          vec2 zeroToOne = a_position / u_resolution;
          vec2 zeroToTwo = zeroToOne * 2.0;
          vec2 clipSpace = zeroToTwo - 1.0;

          gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
          gl_PointSize = 1.2;

          v_color = a_color;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      varying vec4 v_color;

      void main() {
          vec2 pointCoord = gl_PointCoord.xy - vec2(0.5);
          float distance = length(pointCoord);
          float alpha = 1.0 - smoothstep(0.35, 0.5, distance);

          gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
      }
    `;

    function createShader(
      gl: WebGLRenderingContext,
      type: number,
      source: string
    ): WebGLShader | null {
      if (!gl || isCleanedUpRef.current) return null;

      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    function createProgram(
      gl: WebGLRenderingContext,
      vertexShader: WebGLShader,
      fragmentShader: WebGLShader
    ): WebGLProgram | null {
      if (!gl || !vertexShader || !fragmentShader || isCleanedUpRef.current) return null;

      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

    const loadLogo = () => {
      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        if (isCleanedUpRef.current) return;

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCanvas.width = CONFIG.logoSize;
        tempCanvas.height = CONFIG.logoSize;

        tempCtx.clearRect(0, 0, CONFIG.logoSize, CONFIG.logoSize);

        const scale = 0.9;
        const scaledSize = CONFIG.logoSize * scale;
        const offset = (CONFIG.logoSize - scaledSize) / 2;

        tempCtx.drawImage(image, offset, offset, scaledSize, scaledSize);
        const imageData = tempCtx.getImageData(0, 0, CONFIG.logoSize, CONFIG.logoSize);

        initParticleSystem(imageData.data, CONFIG.logoSize);
      };

      image.onerror = () => {
        console.error('Failed to load logo image:', logoPath);
      };

      image.src = logoPath;
    };

    function initParticleSystem(pixels: Uint8ClampedArray, dim: number) {
      if (isCleanedUpRef.current || !canvas || !gl) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particleGridRef.current = [];
      const validParticles: Array<{ ox: number; oy: number; vx: number; vy: number }> = [];
      const validPositions: number[] = [];
      const validColors: number[] = [];

      const logoTint = hexToRgb(CONFIG.logoColor);

      for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
          const pixelIndex = (i * dim + j) * 4;
          const alpha = pixels[pixelIndex + 3];

          if (alpha > 10) {
            const x = centerX + (j - dim / 2) * 1.0;
            const y = centerY + (i - dim / 2) * 1.0;

            validPositions.push(x, y);

            const originalR = pixels[pixelIndex] / 255;
            const originalG = pixels[pixelIndex + 1] / 255;
            const originalB = pixels[pixelIndex + 2] / 255;
            const originalA = pixels[pixelIndex + 3] / 255;

            validColors.push(
              originalR * logoTint.r,
              originalG * logoTint.g,
              originalB * logoTint.b,
              originalA
            );

            validParticles.push({
              ox: x,
              oy: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }

      particleGridRef.current = validParticles;
      posArrayRef.current = new Float32Array(validPositions);
      colorArrayRef.current = new Float32Array(validColors);

      const positionBuffer = gl.createBuffer();
      const colorBuffer = gl.createBuffer();

      if (!positionBuffer || !colorBuffer) return;

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, posArrayRef.current, gl.DYNAMIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colorArrayRef.current, gl.STATIC_DRAW);

      geometryRef.current = {
        positionBuffer,
        colorBuffer,
        vertexCount: validParticles.length,
      };

      console.log(`Created ${validParticles.length} particles`);
      startAnimation();
    }

    function startAnimation() {
      function animate() {
        if (
          isCleanedUpRef.current ||
          !gl ||
          !programRef.current ||
          !geometryRef.current ||
          !posArrayRef.current ||
          !canvas
        ) {
          return;
        }
        if (execCountRef.current > 0) {
          execCountRef.current -= 1;

          const rad = CONFIG.distortionRadius * CONFIG.distortionRadius;
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;

          for (let i = 0, len = particleGridRef.current.length; i < len; i++) {
            const x = posArrayRef.current[i * 2];
            const y = posArrayRef.current[i * 2 + 1];
            const d = particleGridRef.current[i];

            const dx = mx - x;
            const dy = my - y;
            const dis = dx * dx + dy * dy;

            if (dis < rad && dis > 0) {
              const f = -rad / dis;
              const t = Math.atan2(dy, dx);

              const distFromOrigin = Math.sqrt((x - d.ox) * (x - d.ox) + (y - d.oy) * (y - d.oy));

              const forceMultiplier = Math.max(
                0.1,
                1 - distFromOrigin / (CONFIG.maxDisplacement * 2)
              );

              d.vx += f * Math.cos(t) * CONFIG.forceStrength * forceMultiplier;
              d.vy += f * Math.sin(t) * CONFIG.forceStrength * forceMultiplier;
            }

            const newX = x + (d.vx *= 0.82) + (d.ox - x) * CONFIG.returnForce;
            const newY = y + (d.vy *= 0.82) + (d.oy - y) * CONFIG.returnForce;

            const dx_origin = newX - d.ox;
            const dy_origin = newY - d.oy;
            const distFromOrigin = Math.sqrt(dx_origin * dx_origin + dy_origin * dy_origin);

            if (distFromOrigin > CONFIG.maxDisplacement) {
              const excess = distFromOrigin - CONFIG.maxDisplacement;
              const scale = CONFIG.maxDisplacement / distFromOrigin;
              const dampedScale = scale + (1 - scale) * Math.exp(-excess * 0.02);

              posArrayRef.current[i * 2] = d.ox + dx_origin * dampedScale;
              posArrayRef.current[i * 2 + 1] = d.oy + dy_origin * dampedScale;

              d.vx *= 0.7;
              d.vy *= 0.7;
            } else {
              posArrayRef.current[i * 2] = newX;
              posArrayRef.current[i * 2 + 1] = newY;
            }
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArrayRef.current);
        }

        const bgColor = hexToRgb(CONFIG.canvasBg);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(bgColor.r, bgColor.g, bgColor.b, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(programRef.current);

        if (resolutionUniformLocation) {
          gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.colorBuffer);
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, geometryRef.current.vertexCount);

        animationFrameRef.current = requestAnimationFrame(animate);
      }

      animate();
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (isCleanedUpRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      mouseRef.current.x = (event.clientX - rect.left) * dpr;
      mouseRef.current.y = (event.clientY - rect.top) * dpr;
      execCountRef.current = 300;
    };

    const handleResize = () => {
      if (isCleanedUpRef.current) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';

      if (geometryRef.current && particleGridRef.current.length > 0 && posArrayRef.current) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dim = Math.sqrt(particleGridRef.current.length);

        for (let i = 0; i < particleGridRef.current.length; i++) {
          const row = Math.floor(i / dim);
          const col = i % dim;
          const newX = centerX + (col - dim / 2) * 1.0;
          const newY = centerY + (row - dim / 2) * 1.0;

          particleGridRef.current[i].ox = newX;
          particleGridRef.current[i].oy = newY;
          posArrayRef.current[i * 2] = newX;
          posArrayRef.current[i * 2 + 1] = newY;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, geometryRef.current.positionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, posArrayRef.current);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    loadLogo();

    return () => {
      isCleanedUpRef.current = true;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (gl && !gl.isContextLost()) {
        try {
          if (geometryRef.current) {
            if (geometryRef.current.positionBuffer) {
              gl.deleteBuffer(geometryRef.current.positionBuffer);
            }
            if (geometryRef.current.colorBuffer) {
              gl.deleteBuffer(geometryRef.current.colorBuffer);
            }
            geometryRef.current = null;
          }

          if (programRef.current) {
            const shaders = gl.getAttachedShaders(programRef.current);
            if (shaders) {
              shaders.forEach((shader) => {
                gl.detachShader(programRef.current!, shader);
                gl.deleteShader(shader);
              });
            }
            gl.deleteProgram(programRef.current);
            programRef.current = null;
          }
        } catch (error) {
          console.warn('Error during WebGL cleanup:', error);
        }
      }

      particleGridRef.current = [];
      posArrayRef.current = null;
      colorArrayRef.current = null;
      mouseRef.current = { x: 0, y: 0 };
      execCountRef.current = 0;
    };
  }, [
    logoPath,
    logoSize,
    logoColor,
    canvasBg,
    distortionRadius,
    forceStrength,
    maxDisplacement,
    returnForce,
  ]);

  const combinedClassName = `interactive-particle-logo ${className}`.trim();

  return <canvas ref={canvasRef} className={combinedClassName} />;
};
