"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type Point2 = [number, number];

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function extrude(points: Point2[]) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -0.0225);
  return geometry;
}

function diagonalBar(start: Point2, end: Point2, width: number): Point2[] {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy);
  const nx = -dy / length * width / 2;
  const ny = dx / length * width / 2;
  return [
    [start[0] + nx, start[1] + ny],
    [end[0] + nx, end[1] + ny],
    [end[0] - nx, end[1] - ny],
    [start[0] - nx, start[1] - ny],
  ];
}

function createRockGeometry() {
  const geometry = new THREE.IcosahedronGeometry(1, 5);
  const position = geometry.getAttribute("position");
  const vertex = new THREE.Vector3();
  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index).normalize();
    const broad = Math.sin(vertex.x * 8.4 + vertex.y * 4.7) * Math.cos(vertex.z * 7.8 - vertex.x * 3.2);
    const grain = Math.sin(vertex.x * 22 + vertex.z * 17) * Math.cos(vertex.y * 24 - vertex.z * 13);
    const radius = 1 + broad * 0.075 + grain * 0.022;
    position.setXYZ(index, vertex.x * radius * 1.13, vertex.y * radius * 1.42, vertex.z * radius * 0.68);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function createRoughnessMap() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  let seed = 37;
  for (let index = 0; index < size * size; index += 1) {
    seed = (seed * 16807) % 2147483647;
    const value = 82 + seed % 112;
    const pixel = index * 4;
    data[pixel] = value;
    data[pixel + 1] = value;
    data[pixel + 2] = value;
    data[pixel + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 3);
  texture.needsUpdate = true;
  return texture;
}

function createCracks() {
  const paths: Point2[][] = [
    [[-0.94, 0.92], [-0.7, 0.65], [-0.6, 0.3], [-0.78, 0.06], [-0.38, -0.12], [-0.2, -0.48], [-0.42, -0.93]],
    [[-0.2, 1.22], [0.02, 0.96], [0.28, 0.78], [0.17, 0.48], [0.46, 0.28], [0.25, 0.04], [0.57, -0.3], [0.72, -0.72]],
    [[0.93, 0.9], [0.7, 0.62], [0.79, 0.34], [0.58, 0.08], [0.86, -0.18], [0.73, -0.54]],
    [[-0.98, -0.28], [-0.72, -0.45], [-0.84, -0.7], [-0.63, -1.04]],
    [[0.08, -1.28], [0.29, -1.05], [0.2, -0.82], [0.47, -0.62]],
  ];
  return paths.map((path) => {
    const points = path.map(([x, y]) => {
      const ellipse = Math.max(0.02, 1 - (x / 1.13) ** 2 - (y / 1.42) ** 2);
      const z = 0.68 * Math.sqrt(ellipse) + 0.012;
      return new THREE.Vector3(x, y, z);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 36, 0.006, 4, false);
  });
}

function StudioEnvironment() {
  const { gl } = useThree();
  const target = useMemo(() => {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const reflection = generator.fromScene(room);
    generator.dispose();
    room.dispose();
    return reflection;
  }, [gl]);
  useEffect(() => () => target.dispose(), [target]);
  return <primitive attach="environment" object={target.texture} />;
}

function ObsidianMonolith({ reducedMotion }: { reducedMotion: boolean }) {
  const sculpture = useRef<THREE.Group>(null);
  const reflection = useRef<THREE.PointLight>(null);
  const geometry = useMemo(() => createRockGeometry(), []);
  const roughness = useMemo(() => createRoughnessMap(), []);
  const cracks = useMemo(() => createCracks(), []);
  const mark = useMemo(() => [
    extrude([
      [-0.92, -0.52], [-0.92, 0.52], [-0.7, 0.52], [-0.36, -0.06],
      [-0.03, 0.52], [0.18, 0.52], [0.18, -0.52], [-0.04, -0.52],
      [-0.04, 0.16], [-0.36, -0.29], [-0.7, 0.16], [-0.7, -0.52],
    ]),
    extrude(diagonalBar([0.08, 0.05], [0.91, 0.52], 0.15)),
    extrude(diagonalBar([0.08, -0.04], [0.91, -0.52], 0.15)),
  ], []);
  const stone = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#182125",
    metalness: 0.78,
    roughness: 0.27,
    roughnessMap: roughness,
    bumpMap: roughness,
    bumpScale: 0.075,
    clearcoat: 1,
    clearcoatRoughness: 0.22,
    envMapIntensity: 1.15,
  }), [roughness]);
  const carved = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#091013",
    metalness: 0.8,
    roughness: 0.34,
    clearcoat: 0.8,
    clearcoatRoughness: 0.26,
    envMapIntensity: 0.72,
  }), []);
  const crackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#3c8888",
    emissive: "#164b4b",
    emissiveIntensity: 0.65,
    metalness: 0.5,
    roughness: 0.35,
  }), []);

  useEffect(() => () => {
    geometry.dispose();
    roughness.dispose();
    cracks.forEach((item) => item.dispose());
    mark.forEach((item) => item.dispose());
    stone.dispose();
    carved.dispose();
    crackMaterial.dispose();
  }, [carved, crackMaterial, cracks, geometry, mark, roughness, stone]);

  useFrame((_, delta) => {
    if (!sculpture.current) return;
    const section = document.querySelector<HTMLElement>(".services-section");
    const progress = Number(section?.style.getPropertyValue("--service-progress") ?? 0);
    const turn = clamp(progress) * Math.PI * 1.65;
    const damping = 1 - Math.exp(-Math.min(delta, 0.05) * 3.4);
    sculpture.current.rotation.y += ((reducedMotion ? -0.16 : -0.16 + turn) - sculpture.current.rotation.y) * damping;
    sculpture.current.rotation.x += ((reducedMotion ? 0.04 : 0.04 + Math.sin(progress * Math.PI * 2) * 0.12) - sculpture.current.rotation.x) * damping;
    sculpture.current.rotation.z += ((reducedMotion ? 0 : Math.sin(progress * Math.PI) * 0.045) - sculpture.current.rotation.z) * damping;
    sculpture.current.position.y += ((reducedMotion ? 0 : Math.sin(progress * Math.PI * 2) * 0.045) - sculpture.current.position.y) * damping;
    if (reflection.current) reflection.current.intensity = 6 + Math.sin(progress * Math.PI) * 3;
  });

  return <>
    <StudioEnvironment />
    <ambientLight intensity={0.42} color="#a9b7bd" />
    <directionalLight color="#e2f3f1" intensity={2.2} position={[-3.5, 4.5, 4]} />
    <directionalLight color="#75999a" intensity={1.6} position={[3.5, -2.2, -1]} />
    <pointLight ref={reflection} color="#6ac5c0" intensity={9} position={[-2.1, 0.2, 2.5]} distance={7} />
    <pointLight color="#bbd5d4" intensity={5} position={[2.8, 2.2, 1.8]} distance={6} />
    <group ref={sculpture} position={[0.08, -0.06, 0]}>
      <mesh geometry={geometry} material={stone} castShadow receiveShadow />
      {cracks.map((crack, index) => <mesh geometry={crack} material={crackMaterial} key={index} />)}
      <group position={[0.08, 0, 0.73]} scale={0.57}>
        {mark.map((part, index) => <mesh geometry={part} key={index} material={carved} />)}
      </group>
    </group>
  </>;
}

export function ServiceSequence() {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const section = container.current?.closest<HTMLElement>(".services-section");
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduced = () => setReducedMotion(reduced.matches);
    updateReduced();
    reduced.addEventListener("change", updateReduced);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    observer.observe(section);
    return () => {
      observer.disconnect();
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
    let trigger: import("gsap/ScrollTrigger").ScrollTrigger | undefined;

    const updateScene = (outerProgress: number) => {
      const progress = Math.min(1, outerProgress * 1.25);
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
      const stoneOpacity = clamp((progress - 0.02) / 0.1);
      section.style.setProperty("--stone-opacity", String(stoneOpacity));
      section.style.setProperty("--smoke-opacity", String(0.5 * clamp((progress - 0.04) / 0.08)));
      const entryOpacity = 1 - clamp((progress - 0.035) / 0.065);
      section.style.setProperty("--entry-opacity", String(entryOpacity));
      section.style.setProperty("--work-overlay", String(1 - clamp(progress / 0.1)));
      section.style.setProperty("--heading-opacity", String(clamp((progress - 0.16) / 0.05)));
      const textChannel = Math.round(242 - entryOpacity * 206);
      section.style.setProperty("--intro-color", "rgb(" + textChannel + " " + textChannel + " " + textChannel + ")");
      const cardProgress = clamp((progress - 0.56) / 0.44);
      const cardPhase = cardProgress * 3;
      desktopCards.forEach((label, index) => {
        const phase = clamp((cardProgress * 0.85 - index * 0.2) / 0.45);
        const width = Math.round(window.innerWidth * (window.innerWidth < 1512 ? 0.42 : 0.28));
        const height = Math.round(window.innerHeight * 0.32);
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

    const configureMotion = async () => {
      trigger?.kill();
      trigger = undefined;
      if (reducedMotion.matches) {
        section.style.setProperty("--service-progress", "0.5");
        section.style.setProperty("--stone-opacity", "1");
        section.style.setProperty("--smoke-opacity", "0.2");
        if (intro) intro.style.display = "none";
        section.querySelectorAll<HTMLElement>(".service-row").forEach((label) => {
          label.style.removeProperty("--service-offset");
          label.style.removeProperty("--service-opacity");
        });
        return;
      }
      if (intro) intro.style.removeProperty("display");
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: ({ progress }) => setProgress(progress),
        onRefresh: ({ progress }) => setProgress(progress),
      });
      updateScene(trigger.progress);
    };

    void configureMotion();
    reducedMotion.addEventListener("change", configureMotion);
    return () => {
      disposed = true;
      trigger?.kill();
      reducedMotion.removeEventListener("change", configureMotion);
      window.cancelAnimationFrame(motionFrame);
    };
  }, []);

  return <div aria-hidden="true" className="service-sequence-canvas" ref={container}>
    <Canvas camera={{ fov: 36, position: [0, 0, 5.9] }} dpr={[1, 1.25]} frameloop={active && !reducedMotion ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      <ObsidianMonolith reducedMotion={reducedMotion} />
    </Canvas>
  </div>;
}
