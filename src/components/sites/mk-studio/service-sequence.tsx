"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

const particleVertexShader = `
  attribute float aSeed;
  attribute float aInner;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  varying float vLight;

  void main() {
    vec3 p = position;
    float time = uTime * 0.25;
    if (aInner > 0.5) {
      float current = sin(position.y * 14.0 + uTime * 0.7) * 0.5;
      float flowC = cos(current);
      float flowS = sin(current);
      p.xz = mat2(flowC, -flowS, flowS, flowC) * p.xz;
      p *= 1.0 + 0.035 * sin(position.x * 18.0 + position.y * 13.0 - uTime * 0.8);
    } else {
      float drift = uTime * 0.55 + aSeed * 6.283185;
      p.xy += vec2(sin(drift + position.y * 2.0), cos(drift + position.x * 2.0)) * 0.008;
      p.z += sin(drift * 0.8) * 0.006;
    }
    float twist = sin(p.y * 3.4 + time) * 0.025 + uProgress * 0.06;
    float c = cos(twist);
    float s = sin(twist);
    p.xz = mat2(c, -s, s, c) * p.xz;
    float wave = sin(p.x * 5.0 + p.y * 3.0 + time * 1.4)
      * cos(p.z * 4.0 - p.y * 4.0 - time);
    p *= 1.0 + wave * mix(0.02, 0.01, aInner);
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = (1.25 + aSeed * 1.0) * uPixelRatio * (5.9 / -viewPosition.z);
    float streak = sin(atan(p.z, p.x) * 3.0 + p.y * 4.0 + time * 0.8);
    vLight = mix(0.62, 0.96, aSeed) * mix(0.42 + 0.58 * smoothstep(-0.5, 0.7, streak), 1.0, aInner);
    vec3 innerDirection = normalize(position + vec3(0.00001));
    float longitude = atan(innerDirection.z, innerDirection.x);
    float streamA = 1.0 - smoothstep(0.03, 0.24, abs(sin(longitude * 2.0 + innerDirection.y * 5.0 + uTime * 0.8)));
    float streamB = 1.0 - smoothstep(0.03, 0.2, abs(sin(longitude - innerDirection.y * 6.0 - uTime * 0.55)));
    float rim = smoothstep(0.65, 0.98, length(innerDirection.xy));
    float innerShimmer = clamp(0.18 + streamA * 0.55 + streamB * 0.35 + rim * 0.25, 0.0, 1.0);
    vLight *= mix(1.0, innerShimmer, aInner);
  }
`;

const particleFragmentShader = `
  varying float vLight;
  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.15, 0.5, distanceToCenter)) * vLight;
    gl_FragColor = vec4(vec3(0.78, 0.93, 0.91), alpha);
    #include <colorspace_fragment>
  }
`;

function createParticles() {
  const pointsPerOrbit = 12000;
  const outerCount = pointsPerOrbit * 3;
  const innerCount = 7000;
  const total = outerCount + innerCount;
  const positions = new Float32Array(total * 3);
  const seeds = new Float32Array(total);
  const layers = new Float32Array(total);
  const random = (value: number) => {
    const result = Math.sin(value * 127.1 + 311.7) * 43758.5453;
    return result - Math.floor(result);
  };
  for (let index = 0; index < total; index += 1) {
    const inner = index >= outerCount;
    const seed = random(index + 1);
    if (inner) {
      const innerIndex = index - outerCount;
      if (innerIndex < 3000) {
        const stream = Math.floor(innerIndex / 1500);
        const phase = (innerIndex % 1500 + seed) / 1500 * Math.PI * 2;
        const tilt = stream === 0 ? 0.65 : -0.85;
        const x = Math.cos(phase) * 0.225;
        const y = Math.sin(phase) * 0.13;
        const jitter = (random(index + 17) - 0.5) * 0.02;
        positions[index * 3] = x * Math.cos(tilt) - y * Math.sin(tilt) + jitter;
        positions[index * 3 + 1] = x * Math.sin(tilt) + y * Math.cos(tilt) + jitter;
        positions[index * 3 + 2] = Math.sin(phase) * 0.19 + jitter;
      } else {
        const y = 1 - 2 * random(index + 7);
        const ring = Math.sqrt(Math.max(0, 1 - y * y));
        const angle = random(index + 23) * Math.PI * 2;
        const radiusSeed = random(index + 41);
        const radius = 0.24 * (seed > 0.38 ? 0.92 + radiusSeed * 0.08 : Math.cbrt(radiusSeed) * 0.9);
        positions[index * 3] = Math.cos(angle) * ring * radius;
        positions[index * 3 + 1] = y * radius;
        positions[index * 3 + 2] = Math.sin(angle) * ring * radius;
      }
    } else {
      const orbit = Math.floor(index / pointsPerOrbit);
      const phase = ((index % pointsPerOrbit) + seed) / pointsPerOrbit * Math.PI * 2;
      const angle = (orbit - 1) * Math.PI / 3;
      const normalX = Math.cos(phase) / 1.48;
      const normalY = Math.sin(phase) / 0.56;
      const normalLength = Math.hypot(normalX, normalY);
      const spread = (random(index + 57) + random(index + 83) - 1) * (seed > 0.86 ? 0.18 : 0.055);
      const x = Math.cos(phase) * 1.48 + normalX / normalLength * spread;
      const y = Math.sin(phase) * 0.56 + normalY / normalLength * spread;
      positions[index * 3] = x * Math.cos(angle) - y * Math.sin(angle);
      positions[index * 3 + 1] = x * Math.sin(angle) + y * Math.cos(angle);
      positions[index * 3 + 2] = (random(index + 109) - 0.5) * 0.12 + Math.sin(phase) * 0.08;
    }
    seeds[index] = seed;
    layers[index] = inner ? 1 : 0;
  }
  return { positions, seeds, layers };
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
      const x = reducedMotion ? 0 : pointer.current.y * 0.18;
      const y = reducedMotion ? 0 : pointer.current.x * 0.22 + progress * 0.45;
      group.current.rotation.x += (x - group.current.rotation.x) * damping;
      group.current.rotation.y += (y - group.current.rotation.y) * damping;
    }
  });

  return <group ref={group} scale={Math.min(1, viewportWidth / 3.35)}>
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[particles.seeds, 1]} />
        <bufferAttribute attach="attributes-aInner" args={[particles.layers, 1]} />
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
      const cardProgress = clamp((progress - 0.56) / 0.44);
      const cardPhase = cardProgress * Math.max(1, mobileCards.length - 1);
      desktopCards.forEach((label, index) => {
        const travel = 0.45 + Math.max(0, desktopCards.length - 1) * 0.2;
        const phase = clamp((cardProgress * travel - index * 0.2) / 0.45);
        const width = Math.round(window.innerWidth * (window.innerWidth < 1512 ? 0.42 : 0.32));
        const height = Math.max(300, Math.min(430, Math.round(window.innerHeight * 0.36)));
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
      });
      mobileCards.forEach((label, index) => {
        const phase = clamp(progress * 4 - index);
        label.style.setProperty("--service-offset", String(index - cardPhase));
        label.style.setProperty("--service-opacity", String(clamp(1 - Math.abs(index - cardPhase) * 1.15) * clamp((progress - 0.56) * 15)));
        label.classList.toggle("is-active", phase > 0.5);
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
        scrollProgress.current = 0;
        section.style.setProperty("--service-progress", "0.5");
        section.style.setProperty("--network-opacity", "1");
        section.style.setProperty("--smoke-opacity", "0.2");
        if (intro) intro.style.display = "none";
        section.querySelectorAll<HTMLElement>(".service-row").forEach((label) => {
          label.style.removeProperty("--service-offset");
          label.style.removeProperty("--service-opacity");
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
    };
  }, []);

  return <div aria-hidden="true" className="service-sequence-canvas" ref={container}>
    <Canvas camera={{ fov: 36, position: [0, 0, 5.9] }} dpr={[1, 1.25]} frameloop={active && !reducedMotion ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      <ParticleBubble reducedMotion={reducedMotion} scrollProgress={scrollProgress} pointer={pointer} />
    </Canvas>
  </div>;
}
