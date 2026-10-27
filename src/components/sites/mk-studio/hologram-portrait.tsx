"use client";

import Image from "next/image";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { PointerEvent, ReactNode, RefObject } from "react";
import * as THREE from "three";
import styles from "./hologram-portrait.module.css";

const portrait = "/sites/mk-studio/portrait/mihail-cutout-enhanced-v1.png";
type PointerState = { x: number; y: number; dx: number; dy: number; hover: number; lastMoved: number };

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uImage;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec2 uVelocity;
  uniform float uTime;
  uniform float uHover;
  uniform float uMotion;
  varying vec2 vUv;

  vec4 portraitAt(vec2 uv) {
    float aspect = uResolution.x / max(1.0, uResolution.y);
    vec2 imageUv = vec2((uv.x - 0.5) * aspect / (1114.0 / 1411.0) + 0.5, uv.y);
    if (imageUv.x < 0.0 || imageUv.x > 1.0 || imageUv.y < 0.0 || imageUv.y > 1.0) return vec4(0.0);
    return texture2D(uImage, imageUv);
  }

  void main() {
    vec2 centered = vUv * 2.0 - 1.0;
    vec2 uv = (centered * (1.0 + 0.018 * dot(centered, centered)) + 1.0) * 0.5;
    float distanceToPointer = distance(uv, uPointer);
    float influence = exp(-distanceToPointer * distanceToPointer * 20.0) * uHover * uMotion;
    vec2 drift = clamp(uVelocity, vec2(-0.12), vec2(0.12)) * influence * 0.18;
    float ripple = sin(distanceToPointer * 40.0 - uTime * 2.5) * influence * 0.0008;
    uv -= drift + vec2(ripple, ripple * 0.3);

    // Quantize the portrait to the same screen lattice as the RGB subpixel mask.
    vec2 pixel = uv * uResolution;
    vec2 sampleUv = (floor(pixel / 3.5) + 0.5) * 3.5 / uResolution;
    vec4 source = portraitAt(sampleUv);
    vec2 split = vec2((0.65 + influence * 3.0) / uResolution.x, 0.0);
    vec3 rgb = vec3(portraitAt(sampleUv + split).r, source.g, portraitAt(sampleUv - split).b);
    float luminance = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3 mint = luminance * vec3(0.55, 1.02, 0.91);
    vec3 color = mix(rgb, mint, 0.67);
    color = pow(max(color, vec3(0.0)), vec3(0.76)) * 1.15;

    vec2 cell = fract(pixel / 3.5) - 0.5;
    float phosphor = 1.0 - smoothstep(0.30, 0.57, length(cell));
    float channel = mod(floor(pixel.x), 3.0);
    vec3 rgbMask = channel < 1.0 ? vec3(1.0, 0.56, 0.56) : channel < 2.0 ? vec3(0.56, 1.0, 0.56) : vec3(0.56, 0.56, 1.0);
    color *= mix(vec3(1.0), rgbMask, 0.36) * mix(0.43, 1.0, phosphor);
    color *= 0.94 + 0.06 * sin(pixel.y * 3.14159);

    vec2 glowOffset = vec2(2.5) / uResolution;
    vec3 glow = portraitAt(uv + vec2(glowOffset.x, 0.0)).rgb
      + portraitAt(uv - vec2(glowOffset.x, 0.0)).rgb
      + portraitAt(uv + vec2(0.0, glowOffset.y)).rgb
      + portraitAt(uv - vec2(0.0, glowOffset.y)).rgb;
    color += glow * vec3(0.045, 0.075, 0.065);
    color *= 1.0 + 0.018 * sin(uTime * 1.8 + pixel.y * 0.008) * uMotion;
    float scan = exp(-pow((uv.y - fract(uTime * 0.065)) * 90.0, 2.0)) * 0.035 * uMotion;
    color += vec3(0.45, 0.85, 0.75) * scan;
    float bottomFade = smoothstep(0.0, 0.10, vUv.y);
    gl_FragColor = vec4(color * source.a, source.a * bottomFade);
    #include <colorspace_fragment>
  }
`;

function PortraitSurface({ pointer, reducedMotion, onReady }: {
  pointer: RefObject<PointerState>;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  const source = useLoader(THREE.TextureLoader, portrait);
  const texture = useMemo(() => {
    const image = source.clone();
    image.colorSpace = THREE.SRGBColorSpace;
    image.minFilter = THREE.LinearFilter;
    image.generateMipmaps = false;
    image.needsUpdate = true;
    return image;
  }, [source]);
  const { size, gl } = useThree();
  const elapsed = useRef(0);
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uImage: { value: texture },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uVelocity: { value: new THREE.Vector2() },
    uTime: { value: 0 },
    uHover: { value: 0 },
    uMotion: { value: 0 },
  }), [texture]);

  useEffect(() => {
    onReady();
    return () => texture.dispose();
  }, [onReady, texture]);

  useFrame((_, delta) => {
    if (!material.current) return;
    const uniforms = material.current.uniforms;
    const blend = 1 - Math.exp(-Math.min(delta, 0.05) * 9);
    const moving = performance.now() - pointer.current.lastMoved < 80;
    if (!reducedMotion) elapsed.current += Math.min(delta, 0.05);
    uniforms.uTime.value = elapsed.current;
    uniforms.uMotion.value = reducedMotion ? 0 : 1;
    uniforms.uResolution.value.set(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio());
    uniforms.uPointer.value.x += (pointer.current.x - uniforms.uPointer.value.x) * blend;
    uniforms.uPointer.value.y += (pointer.current.y - uniforms.uPointer.value.y) * blend;
    uniforms.uVelocity.value.x += ((moving ? pointer.current.dx : 0) - uniforms.uVelocity.value.x) * blend;
    uniforms.uVelocity.value.y += ((moving ? pointer.current.dy : 0) - uniforms.uVelocity.value.y) * blend;
    uniforms.uHover.value += (pointer.current.hover - uniforms.uHover.value) * blend;
  });

  return <mesh frustumCulled={false}>
    <planeGeometry args={[2, 2]} />
    <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} toneMapped={false} />
  </mesh>;
}

class PortraitBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.warn("Portrait WebGL unavailable; using the photograph.", error); this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function HologramPortrait() {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0.5, y: 0.5, dx: 0, dy: 0, hover: 0, lastMoved: 0 });
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setReady(false), []);

  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setActive(entry.isIntersecting);
      if (entry.isIntersecting) setMounted(true);
    }, { rootMargin: "120px" });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    pointer.current.dx = x - pointer.current.x;
    pointer.current.dy = y - pointer.current.y;
    pointer.current.x = x;
    pointer.current.y = y;
    pointer.current.hover = 1;
    pointer.current.lastMoved = performance.now();
  };

  return <div ref={container} className={`${styles.root}${ready ? ` ${styles.ready}` : ""}`} onPointerMove={move} onPointerLeave={() => { pointer.current.hover = 0; }}>
    <Image className={styles.fallback} src={portrait} alt="Михаил Кудрицкий — веб-разработчик в Ташкенте и преподаватель PROWEB" width={1114} height={1411} sizes="(max-width: 767px) 100vw, 45vw" unoptimized />
    {mounted && <div className={styles.canvas} aria-hidden="true"><PortraitBoundary onFailure={onFailure}>
      <Canvas dpr={[1, 1.25]} frameloop={active && !reducedMotion ? "always" : "demand"} gl={{ alpha: true, antialias: false, powerPreference: "low-power" }} fallback={null}>
        <Suspense fallback={null}><PortraitSurface pointer={pointer} reducedMotion={reducedMotion} onReady={onReady} /></Suspense>
      </Canvas>
    </PortraitBoundary></div>}
  </div>;
}
