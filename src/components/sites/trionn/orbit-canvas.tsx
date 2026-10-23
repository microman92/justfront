"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type OrbitCanvasProps = {
  active: boolean;
  blast: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  scrollPosition: React.RefObject<number>;
};

// Three hooked outlines traced from the source brand SVG's 22 × 24 coordinate space.
const outlines = [
  [[10.8, 14.06], [12.8, 14.06], [17.3, 21.9], [15.3, 21.9], [13.46, 18.94], [2.5, 18.94], [3.7, 17.1], [12.35, 17.1]],
  [[16.9, 2.36], [17.9, 4.18], [16.18, 7.25], [21.64, 16.66], [19.4, 16.6], [15.1, 9.25], [13.4, 12.23], [12.3, 10.4]],
  [[10.3, 1.94], [11.3, 3.76], [7, 11.17], [10.65, 11.17], [9.5, 13.1], [0.17, 13.1], [1.36, 11.17], [4.7, 11.17]],
];

const smoothstep = (start: number, end: number, value: number) => {
  const t = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
};

const scrollBreakup = (scroll: number) => {
  if (scroll <= 0.1) return 0;
  if (scroll <= 1) return (scroll - 0.1) / 0.9;
  if (scroll <= 1.2) return 1;
  if (scroll <= 1.8) return (1.8 - scroll) / 0.6;
  return 0;
};

function extrude(points: THREE.Vector2[], depth: number) {
  const geometry = new THREE.ExtrudeGeometry(new THREE.Shape(points), {
    depth, bevelEnabled: true, bevelThickness: 0.024, bevelSize: 0.022,
    bevelSegments: 2, steps: 1, curveSegments: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

type SurfacePiece = {
  geometry: THREE.BufferGeometry;
  drift: THREE.Vector3;
  spin: THREE.Vector3;
  delay: number;
};

// Every triangle of the assembled volume belongs to one moving surface patch.
// The patches occupy the original solid exactly at rest, so breakup removes the
// entire object instead of drawing unrelated shards over three intact slabs.
function splitSurface(source: THREE.ExtrudeGeometry, shapeIndex: number): SurfacePiece[] {
  const position = source.getAttribute("position");
  const normal = source.getAttribute("normal");
  const color = source.getAttribute("color");
  source.computeBoundingBox();
  const shapeCenter = source.boundingBox!.getCenter(new THREE.Vector3());
  const groups = new Map<string, { positions: number[]; normals: number[]; colors: number[]; sum: THREE.Vector3; count: number; face: THREE.Vector3 }>();

  for (let vertex = 0; vertex < position.count; vertex += 3) {
    const nx = Math.round(normal.getX(vertex) * 10) / 10;
    const ny = Math.round(normal.getY(vertex) * 10) / 10;
    const nz = Math.round(normal.getZ(vertex) * 10) / 10;
    const centerY = (position.getY(vertex) + position.getY(vertex + 1) + position.getY(vertex + 2)) / 3;
    // Split the broad front and back faces along their existing triangle seams.
    const band = Math.abs(nz) > 0.9 ? Math.floor((centerY + 2) / 0.58) : 0;
    const key = `${nx},${ny},${nz},${band}`;
    let patch = groups.get(key);
    if (!patch) {
      patch = { positions: [], normals: [], colors: [], sum: new THREE.Vector3(), count: 0, face: new THREE.Vector3(nx, ny, nz) };
      groups.set(key, patch);
    }
    for (let offset = 0; offset < 3; offset += 1) {
      const index = vertex + offset;
      const x = position.getX(index);
      const y = position.getY(index);
      const z = position.getZ(index);
      patch.positions.push(x, y, z);
      patch.normals.push(normal.getX(index), normal.getY(index), normal.getZ(index));
      patch.colors.push(color.getX(index), color.getY(index), color.getZ(index));
      patch.sum.add(new THREE.Vector3(x, y, z));
      patch.count += 1;
    }
  }

  return [...groups.values()].map((patch, index) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(patch.positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(patch.normals, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(patch.colors, 3));
    const center = patch.sum.divideScalar(patch.count);
    const radial = center.clone().sub(shapeCenter).normalize();
    const drift = radial.multiplyScalar(0.6).add(patch.face.normalize().multiplyScalar(0.4)).normalize();
    const seed = shapeIndex * 113 + index * 17;
    const spin = new THREE.Vector3(Math.sin(seed * 0.73), Math.cos(seed * 0.47), Math.sin(seed * 1.13)).normalize().multiplyScalar((Math.sin(seed * 0.31) * 0.4));
    return { geometry, drift, spin, delay: ((seed * 37) % 29) / 29 * 0.25 };
  });
}

function StudioReflections() {
  const { gl } = useThree();
  const target = useMemo(() => {
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const target = generator.fromScene(room);
    generator.dispose();
    room.dispose();
    return target;
  }, [gl]);
  useEffect(() => () => target.dispose(), [target]);

  return <primitive attach="environment" object={target.texture} />;
}

function Monogram({ blast, pointer, reducedMotion, scrollPosition }: OrbitCanvasProps) {
  const group = useRef<THREE.Group>(null);
  const surface = useRef<THREE.Group>(null);
  const blueprint = useRef<THREE.Group>(null);
  const amount = useRef(0);
  const elapsed = useRef(0);
  const resources = useMemo(() => {
    const polygons = outlines.map((outline) => outline.map(([x, y]) => new THREE.Vector2((x - 10.8) * 0.15, (12 - y) * 0.15)));
    const solids = polygons.map((points, index) => {
      const geometry = extrude(points, 0.36);
      const position = geometry.getAttribute("position");
      const colors = new Float32Array(position.count * 3);
      const dark = new THREE.Color("#090c12");
      const ivory = new THREE.Color("#d4d2c8");
      const amber = new THREE.Color("#85351f");
      const color = new THREE.Color();
      for (let vertex = 0; vertex < position.count; vertex += 1) {
        const x = position.getX(vertex);
        const y = position.getY(vertex);
        const upperLight = index === 2 ? smoothstep(0.45, 1.55, y) : 0;
        const rightLight = index === 1 ? smoothstep(1.25, 1.6, x) * (1 - smoothstep(0.35, 1.25, y)) : 0;
        color.copy(dark).lerp(amber, Math.max(upperLight * 0.32, rightLight * 0.38));
        if (index === 2) color.lerp(ivory, smoothstep(1.35, 1.7, y) * 0.42);
        if (index === 1) color.lerp(ivory, rightLight * 0.16);
        colors[vertex * 3] = color.r;
        colors[vertex * 3 + 1] = color.g;
        colors[vertex * 3 + 2] = color.b;
      }
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      return geometry;
    });
    const edges = solids.map((geometry) => new THREE.EdgesGeometry(geometry, 28));
    const pieces = solids.flatMap((geometry, index) => splitSurface(geometry, index));
    return { solids, edges, pieces };
  }, []);
  const materials = useMemo(() => ({
    glass: new THREE.MeshPhysicalMaterial({
      color: "#ffffff", vertexColors: true, metalness: 0.08, roughness: 0.08,
      transmission: 0.22, thickness: 0.9, ior: 1.48, clearcoat: 1,
      clearcoatRoughness: 0.05, envMapIntensity: 0.42, side: THREE.DoubleSide,
    }),
    blueprint: new THREE.LineBasicMaterial({ color: "#5e6c82", transparent: true, opacity: 0, depthWrite: false }),
  }), []);
  useEffect(() => () => {
    resources.solids.forEach((geometry) => geometry.dispose());
    resources.edges.forEach((geometry) => geometry.dispose());
    resources.pieces.forEach(({ geometry }) => geometry.dispose());
    Object.values(materials).forEach((material) => material.dispose());
  }, [resources, materials]);

  useFrame((state, delta) => {
    if (!group.current || !surface.current || !blueprint.current) return;
    elapsed.current += Math.min(delta, 0.05);
    const scroll = scrollPosition.current;
    const target = reducedMotion ? 0 : Math.max(blast ? 1 : 0, scrollBreakup(scroll));
    amount.current += (target - amount.current) * (1 - Math.exp(-delta * (blast ? 9 : 3.7)));
    const progress = amount.current;
    const visionDarkening = smoothstep(0.78, 1.9, scroll);
    const glassBrightness = THREE.MathUtils.lerp(1, 0.34, visionDarkening)
      * THREE.MathUtils.lerp(1, 0.2, smoothstep(0.06, 0.62, progress));
    const glassMaterial = (surface.current.children[0] as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
    glassMaterial.color.setRGB(glassBrightness, glassBrightness, glassBrightness);
    glassMaterial.specularIntensity = THREE.MathUtils.lerp(0.6, 0.16, Math.max(visionDarkening, progress));
    glassMaterial.clearcoat = THREE.MathUtils.lerp(0.65, 0.22, visionDarkening);
    glassMaterial.envMapIntensity = Math.min(
      THREE.MathUtils.lerp(0.42, 0.12, smoothstep(0.06, 0.62, progress)),
      THREE.MathUtils.lerp(0.42, 0.08, smoothstep(1.75, 2.05, scroll)),
    );
    state.scene.environmentIntensity = THREE.MathUtils.lerp(0.35, 0.12, visionDarkening);

    const damping = 1 - Math.exp(-delta * 3.5);
    const aimX = reducedMotion ? 0 : pointer.current.y;
    const aimY = reducedMotion ? 0 : pointer.current.x;
    const visionScale = state.size.width >= 480 && state.size.width < 768
      ? THREE.MathUtils.lerp(1, 0.58, smoothstep(1.75, 2.05, scroll))
      : 1;
    group.current.scale.setScalar(Math.min(0.94, state.viewport.width / 4.2) * visionScale);
    group.current.rotation.x += ((0.08 + aimX * 0.07) - group.current.rotation.x) * damping;
    group.current.rotation.y = reducedMotion ? -0.36 : -0.36 + elapsed.current * 0.25 + aimY * 0.07;
    group.current.rotation.z = reducedMotion ? -0.06 : -0.06 + Math.sin(elapsed.current * 0.14) * 0.035;

    surface.current.children.forEach((child, index) => {
      const piece = resources.pieces[index];
      const breakup = Math.max(0, progress - piece.delay);
      child.position.set(
        piece.drift.x * 5.5 * breakup,
        piece.drift.y * 5.5 * breakup,
        piece.drift.z * 5.5 * breakup,
      );
      child.rotation.set(
        piece.spin.x * breakup * Math.PI,
        piece.spin.y * breakup * Math.PI,
        piece.spin.z * breakup * Math.PI,
      );
    });
    const blueprintMaterial = (blueprint.current.children[0] as THREE.LineSegments).material as THREE.LineBasicMaterial;
    blueprintMaterial.opacity = Math.min(
      0.17,
      Math.max(0, progress - 0.08) * 0.22 + 0.075 * smoothstep(1.75, 2.05, scroll),
    );
    blueprint.current.visible = blueprintMaterial.opacity > 0.001;
  });

  return <>
    <ambientLight intensity={0.12} />
    <directionalLight color="#d9e3f0" intensity={0.42} position={[-3, 4, 4]} />
    <directionalLight color="#657487" intensity={0.16} position={[4, -2, 3]} />
    <pointLight color="#e96726" intensity={blast ? 5 : 0.25} position={[-1.7, 1.8, 1.4]} distance={7} />
    <group ref={group} position={[0.18, -0.02, 0]}>
      <group ref={surface}>
        {resources.pieces.map(({ geometry }, index) => <mesh key={index} geometry={geometry} material={materials.glass} />)}
      </group>
      <group ref={blueprint} visible={false}>
        {resources.edges.map((geometry, index) => <lineSegments geometry={geometry} material={materials.blueprint} key={index} />)}
      </group>
    </group>
  </>;
}

function EnergyLines({ scrollPosition, reducedMotion }: OrbitCanvasProps) {
  const threads = useRef<THREE.LineSegments>(null);
  const slivers = useRef<THREE.LineSegments>(null);
  const sparks = useRef<THREE.Points>(null);
  const resources = useMemo(() => {
    const threads = new THREE.BufferGeometry();
    threads.setAttribute("position", new THREE.Float32BufferAttribute([
      -9, -4, 0, 9, 4, 0,
      -8, -2.6, -0.2, 8, 1.5, -0.2,
      -5, -5, -0.3, 6, 6, -0.3,
    ], 3));
    const streaks = new THREE.BufferGeometry();
    const strokes = new Float32Array(48 * 6);
    for (let index = 0; index < 48; index += 1) {
      const x = (((index * 71) % 97) / 97 - 0.5) * 11;
      const y = (((index * 43) % 89) / 89 - 0.5) * 7;
      const length = index % 17 === 0 ? 0.36 : 0.035 + (index % 7) * 0.016;
      strokes.set([x, y, -0.3, x + length, y + length * 0.38, -0.3], index * 6);
    }
    streaks.setAttribute("position", new THREE.BufferAttribute(strokes, 3));
    const dust = new THREE.BufferGeometry();
    const positions = new Float32Array(110 * 3);
    for (let index = 0; index < 110; index += 1) {
      positions[index * 3] = (((index * 71) % 113) / 113 - 0.5) * 11;
      positions[index * 3 + 1] = (((index * 43) % 109) / 109 - 0.5) * 6;
      positions[index * 3 + 2] = -0.5;
    }
    dust.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { threads, streaks, dust };
  }, []);
  const streakMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: "#8993a3", transparent: true, opacity: 0 }), []);
  useEffect(() => () => {
    Object.values(resources).forEach((geometry) => geometry.dispose());
    streakMaterial.dispose();
  }, [resources, streakMaterial]);
  useFrame((_, delta) => {
    const scroll = scrollPosition.current;
    const breakup = reducedMotion ? 0 : scrollBreakup(scroll);
    if (threads.current) (threads.current.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.lerp(0.32, 0.02, smoothstep(1.75, 2.1, scroll));
    if (slivers.current) (slivers.current.material as THREE.LineBasicMaterial).opacity = breakup * 0.22;
    if (slivers.current) slivers.current.rotation.z += Math.min(delta, 0.05) * breakup * 0.01;
    if (sparks.current) sparks.current.rotation.z += Math.min(delta, 0.05) * 0.003;
  });
  return <>
    <lineSegments ref={threads} geometry={resources.threads}><lineBasicMaterial color="#293640" transparent opacity={0.32} /></lineSegments>
    <lineSegments ref={slivers} geometry={resources.streaks} material={streakMaterial} />
    <points ref={sparks} geometry={resources.dust}><pointsMaterial color="#a9602c" size={0.009} transparent opacity={0.34} sizeAttenuation /></points>
  </>;
}

export function OrbitCanvas(props: OrbitCanvasProps) {
  return <div aria-hidden="true" className="hero-canvas" style={{ inset: 0 }}>
    <Canvas camera={{ fov: 38, position: [0, 0, 8.2] }} dpr={[1, 1.35]} frameloop={props.reducedMotion || !props.active ? "demand" : "always"} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      <StudioReflections />
      <Monogram {...props} />
      <EnergyLines {...props} />
    </Canvas>
  </div>;
}

