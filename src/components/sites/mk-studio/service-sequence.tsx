"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

const particleVertexShader = `
  attribute float aSeed;
  attribute float aRadius;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  varying float vRadius;
  varying float vSeed;

  void main() {
    float angle = uTime * 0.16 * (1.0 - aRadius) + uProgress * 0.12;
    float c = cos(angle);
    float s = sin(angle);
    vec3 p = position;
    p.xy = mat2(c, -s, s, c) * p.xy;
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = (1.4 + aSeed * 3.0) * uPixelRatio * (5.9 / -viewPosition.z);
    vRadius = aRadius;
    vSeed = aSeed;
  }
`;

const particleFragmentShader = `
  varying float vRadius;
  varying float vSeed;
  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    float glow = pow(max(0.0, 1.0 - distanceToCenter * 2.0), 1.6);
    vec3 inner = vec3(0.75, 0.96, 0.91);
    vec3 outer = vec3(0.16, 0.52, 0.55);
    vec3 color = mix(inner, outer, smoothstep(0.0, 1.0, vRadius));
    gl_FragColor = vec4(color, glow * mix(0.45, 0.95, vSeed));
    #include <colorspace_fragment>
  }
`;

function createParticles() {
  const total = 20000;
  const positions = new Float32Array(total * 3);
  const seeds = new Float32Array(total);
  const radii = new Float32Array(total);
  const random = (value: number) => {
    const result = Math.sin(value * 127.1 + 311.7) * 43758.5453;
    return result - Math.floor(result);
  };
  for (let index = 0; index < total; index += 1) {
    const seed = random(index + 1);
    const ratio = Math.pow(random(index + 17), 1.5);
    const radius = ratio * 2.25;
    const branch = (index % 3) * Math.PI * 2 / 3;
    const angle = branch + radius * 1.25;
    const spread = 0.06 + ratio * 0.48;
    const offset = (n: number) => Math.pow(random(index + n) * 2 - 1, 3) * spread;
    positions[index * 3] = Math.cos(angle) * radius + offset(37);
    positions[index * 3 + 1] = Math.sin(angle) * radius + offset(61);
    positions[index * 3 + 2] = offset(89) * 0.4;
    seeds[index] = seed;
    radii[index] = ratio;
  }
  return { positions, seeds, radii };
}

function ParticleBubble({ reducedMotion, scrollProgress, pointer }: {
  reducedMotion: boolean;
  scrollProgress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const elapsed = useRef(0);
  const { gl } = useThree();
  const viewportWidth = useThree((state) => state.viewport.width);
  const particles = useMemo(() => createParticles(), []);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.25) },
  }), [gl]);

  useFrame((_, delta) => {
    const progress = reducedMotion ? 0 : clamp(scrollProgress.current);
    if (!reducedMotion) elapsed.current += Math.min(delta, 0.05);
    if (material.current) {
      material.current.uniforms.uTime.value = reducedMotion ? 0 : elapsed.current;
      material.current.uniforms.uProgress.value = progress;
    }
    if (group.current) {
      const damping = 1 - Math.exp(-Math.min(delta, 0.05) * 2.8);
      const x = 0.55 + (reducedMotion ? 0 : pointer.current.y * 0.10);
      const y = reducedMotion ? 0 : pointer.current.x * 0.22 + progress * 0.45;
      group.current.rotation.x += (x - group.current.rotation.x) * damping;
      group.current.rotation.y += (y - group.current.rotation.y) * damping;
      group.current.rotation.z = reducedMotion ? 0 : -elapsed.current * 0.06;
    }
  });

  return <group ref={group} scale={Math.min(1, viewportWidth / 4.8)}>
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[particles.seeds, 1]} />
        <bufferAttribute attach="attributes-aRadius" args={[particles.radii, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={particleVertexShader} fragmentShader={particleFragmentShader} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  </group>;
}

export function ServiceSequence() {
  const container = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const section = container.current?.closest<HTMLElement>(".services-section");
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduced = () => setReducedMotion(reduced.matches);
    updateReduced();
    reduced.addEventListener("change", updateReduced);
    const panel = section.querySelector<HTMLElement>(".service-sticky");
    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reduced.matches) return;
      pointer.current.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.current.y = 1 - event.clientY / window.innerHeight * 2;
    };
    const resetPointer = () => { pointer.current.x = 0; pointer.current.y = 0; };
    panel?.addEventListener("pointermove", movePointer, { passive: true });
    panel?.addEventListener("pointerleave", resetPointer);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    observer.observe(section);
    return () => {
      observer.disconnect();
      panel?.removeEventListener("pointermove", movePointer);
      panel?.removeEventListener("pointerleave", resetPointer);
      reduced.removeEventListener("change", updateReduced);
    };
  }, []);

  useEffect(() => {
    const containerElement = container.current;
    const section = containerElement?.closest<HTMLElement>(".services-section");
    if (!containerElement || !section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stripes = [...section.querySelectorAll<HTMLElement>(".service-exit-stripe")];
    const intro = section.querySelector<HTMLElement>(".service-intro-words");
    const letters = [...section.querySelectorAll<HTMLElement>(".service-intro-letter")];
    const desktopCards = [...section.querySelectorAll<HTMLElement>(".service-desktop-list .service-row")];
    const mobileCards = [...section.querySelectorAll<HTMLElement>(".service-mobile-list .service-row")];
    let disposed = false;
    let motionFrame = 0;
    let targetProgress = 0;
    let displayedProgress = 0;
    let lastMotionTime = 0;
    let tracking = false;

    const updateScene = (outerProgress: number) => {
      const progress = Math.min(1, outerProgress * 1.25);
      scrollProgress.current = outerProgress;
      const exitProgress = clamp((outerProgress - 0.8) / 0.2);
      stripes.forEach((stripe, index) => {
        stripe.style.transform = "scaleY(" + clamp(exitProgress * 2 - (4 - index) * 0.25) + ")";
      });
      const scatter = clamp((progress - 0.35) / 0.18);
      if (intro) intro.style.opacity = String(1 - clamp((progress - 0.38) / 0.15));
      letters.forEach((letter, index) => {
        const angle = index * 2.39996;
        const distance = 120 + (index % 7) * 75;
        const rotation = (index % 2 ? -1 : 1) * scatter * (35 + index % 6 * 18);
        letter.style.transform = "translate3d(" + Math.cos(angle) * distance * scatter + "px," + Math.sin(angle) * distance * scatter + "px,0) rotate(" + rotation + "deg)";
        letter.style.opacity = String(1 - clamp((scatter - 0.45) / 0.55));
      });
      const networkOpacity = clamp((progress - 0.02) / 0.1);
      section.style.setProperty("--network-opacity", String(networkOpacity));
      section.style.setProperty("--smoke-opacity", String(0.5 * clamp((progress - 0.04) / 0.08)));
      const entryOpacity = 1 - clamp((progress - 0.035) / 0.065);
      section.style.setProperty("--entry-opacity", String(entryOpacity));
      section.style.setProperty("--work-overlay", String(1 - clamp(progress / 0.1)));
      section.style.setProperty("--heading-opacity", String(clamp((progress - 0.16) / 0.05)));
      section.style.setProperty("--intro-color", "#dce7e5");
      const cardProgress = clamp((progress - 0.48) / 0.52);
      const cardPhase = cardProgress * Math.max(1, mobileCards.length - 1);
      const desktopWidth = desktopCards[0]?.offsetWidth || 0;
      const desktopHeight = desktopCards[0]?.offsetHeight || 0;
      desktopCards.forEach((label, index) => {
        const phase = clamp(cardProgress * desktopCards.length - index);
        const width = desktopWidth;
        const height = desktopHeight;
        const inset = window.innerWidth < 1512 ? 40 : window.innerWidth * 0.1;
        const bend = phase <= 0.5 ? Math.sin(phase * Math.PI) : 1;
        const left = index % 2 === 0;
        const startX = left ? -0.7 * width : window.innerWidth - 0.3 * width;
        const endX = left ? inset : window.innerWidth - inset - width;
        const y = left ? window.innerHeight - phase * (window.innerHeight + height) : -height + phase * (window.innerHeight + height);
        const opacity = phase < 0.15 ? phase / 0.15 : phase > 0.85 ? (1 - phase) / 0.15 : 1;
        label.style.setProperty("--service-opacity", String(opacity));
        label.style.setProperty("--service-x", String(startX + bend * (endX - startX)) + "px");
        label.style.setProperty("--service-y", String(y) + "px");
        label.classList.toggle("is-active", opacity > 0.5);
        label.inert = opacity <= 0.5;
      });
      mobileCards.forEach((label, index) => {
        const distance = Math.abs(index - cardPhase);
        const opacity = clamp(1 - distance * 1.15) * clamp((progress - 0.48) * 15);
        label.style.setProperty("--service-offset", String(index - cardPhase));
        label.style.setProperty("--service-opacity", String(opacity));
        label.classList.toggle("is-active", opacity > 0.5);
        label.inert = opacity <= 0.5;
      });
      section.style.setProperty("--service-progress", String(progress));
    };

    const advanceMotion = (time: number) => {
      motionFrame = 0;
      if (disposed) return;
      const elapsed = lastMotionTime ? Math.min(50, time - lastMotionTime) : 16.67;
      lastMotionTime = time;
      displayedProgress += (targetProgress - displayedProgress) * (1 - Math.pow(0.88, elapsed / 16.67));
      if (Math.abs(targetProgress - displayedProgress) < 0.00005) displayedProgress = targetProgress;
      updateScene(displayedProgress);
      if (displayedProgress !== targetProgress) motionFrame = requestAnimationFrame(advanceMotion);
      else lastMotionTime = 0;
    };
    const setProgress = (progress: number) => {
      targetProgress = progress;
      if (!motionFrame) motionFrame = requestAnimationFrame(advanceMotion);
    };

    const measureProgress = () => {
      const rect = section.getBoundingClientRect();
      setProgress(clamp(-rect.top / Math.max(1, rect.height - window.innerHeight)));
    };

    const configureMotion = () => {
      if (tracking) {
        window.removeEventListener("scroll", measureProgress);
        window.removeEventListener("resize", measureProgress);
        tracking = false;
      }
      if (reducedMotion.matches) {
        window.cancelAnimationFrame(motionFrame);
        motionFrame = 0;
        scrollProgress.current = 0;
        section.style.setProperty("--service-progress", "0.5");
        section.style.setProperty("--network-opacity", "1");
        section.style.setProperty("--smoke-opacity", "0.2");
        if (intro) intro.style.display = "none";
        section.querySelectorAll<HTMLElement>(".service-row").forEach((label) => {
          label.style.removeProperty("--service-offset");
          label.style.removeProperty("--service-opacity");
          label.inert = false;
        });
        return;
      }
      if (intro) intro.style.removeProperty("display");
      window.addEventListener("scroll", measureProgress, { passive: true });
      window.addEventListener("resize", measureProgress);
      tracking = true;
      measureProgress();
    };

    void configureMotion();
    reducedMotion.addEventListener("change", configureMotion);
    return () => {
      disposed = true;
      window.removeEventListener("scroll", measureProgress);
      window.removeEventListener("resize", measureProgress);
      reducedMotion.removeEventListener("change", configureMotion);
      window.cancelAnimationFrame(motionFrame);
      [...desktopCards, ...mobileCards].forEach((label) => { label.inert = false; });
    };
  }, []);

  return <div aria-hidden="true" className="service-sequence-canvas" ref={container}>
    <Canvas camera={{ fov: 36, position: [0, 0, 5.9] }} dpr={[1, 1.25]} frameloop={active && !reducedMotion ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      <ParticleBubble reducedMotion={reducedMotion} scrollProgress={scrollProgress} pointer={pointer} />
    </Canvas>
  </div>;
}
