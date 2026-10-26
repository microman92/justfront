"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

type OrbitCanvasProps = {
  active: boolean;
  blast: boolean;
  pointer: React.RefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  scrollPosition: React.RefObject<number>;
};

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

function extrude(shape: THREE.Shape, depth: number) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: 3.8, bevelSize: 3.4,
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
  const logo = useLoader(SVGLoader, "/sites/mk-studio/brand/justfront-mark.svg");
  const resources = useMemo(() => {
    const paths = logo.paths.flatMap((path) => path.toShapes().map((shape) => ({ shape, color: path.color.clone() })));
    const scale = 4.4 / 788;
    const solids = paths.map(({ shape }) => {
      const geometry = extrude(shape, 60);
      geometry.scale(scale, -scale, scale);
      geometry.computeBoundingBox();
      return geometry;
    });
    const bounds = new THREE.Box3();
    solids.forEach((geometry) => bounds.union(geometry.boundingBox!));
    const center = bounds.getCenter(new THREE.Vector3());
    solids.forEach((geometry, index) => {
      geometry.translate(-center.x, -center.y, -center.z);
      geometry.computeVertexNormals();
      const position = geometry.getAttribute("position");
      const normal = geometry.getAttribute("normal");
      const colors = new Float32Array(position.count * 3);
      const base = paths[index].color;
      const chrome = new THREE.Color("#d9e7e5");
      const shadow = new THREE.Color("#152326");
      const color = new THREE.Color();
      for (let vertex = 0; vertex < position.count; vertex += 1) {
        const x = position.getX(vertex);
        const y = position.getY(vertex);
        const z = position.getZ(vertex);
        const front = Math.abs(normal.getZ(vertex)) > 0.9;
        const topLight = smoothstep(-0.45, 1.85, y) * (front ? 0.34 : 0.12);
        const edgeLight = smoothstep(0.8, 1.9, x) * (1 - smoothstep(-0.25, 1.1, y));
        color.copy(base).lerp(chrome, topLight + edgeLight * 0.18);
        if (!front) color.lerp(shadow, 0.22);
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
  }, [logo]);
  const materials = useMemo(() => ({
    chrome: new THREE.MeshPhysicalMaterial({
      color: "#ffffff", vertexColors: true, metalness: 0.92, roughness: 0.2,
      clearcoat: 0.86, clearcoatRoughness: 0.18, envMapIntensity: 0.78,
      side: THREE.DoubleSide,
    }),
    blueprint: new THREE.LineBasicMaterial({ color: "#70b9b6", transparent: true, opacity: 0, depthWrite: false }),
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
    const chromeMaterial = (surface.current.children[0] as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
    chromeMaterial.color.setRGB(glassBrightness, glassBrightness, glassBrightness);
    chromeMaterial.specularIntensity = THREE.MathUtils.lerp(0.82, 0.2, Math.max(visionDarkening, progress));
    chromeMaterial.clearcoat = THREE.MathUtils.lerp(0.86, 0.24, visionDarkening);
    chromeMaterial.envMapIntensity = Math.min(
      THREE.MathUtils.lerp(0.78, 0.15, smoothstep(0.06, 0.62, progress)),
      THREE.MathUtils.lerp(0.42, 0.08, smoothstep(1.75, 2.05, scroll)),
    );
    state.scene.environmentIntensity = THREE.MathUtils.lerp(0.35, 0.12, visionDarkening);

    const damping = 1 - Math.exp(-delta * 3.5);
    const aimX = reducedMotion ? 0 : pointer.current.y;
    const aimY = reducedMotion ? 0 : pointer.current.x;
    const visionScale = state.size.width >= 480 && state.size.width < 768
      ? THREE.MathUtils.lerp(1, 0.58, smoothstep(1.75, 2.05, scroll))
      : 1;
    group.current.scale.setScalar(Math.min(0.94, state.viewport.width / 4.8) * visionScale);
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
    <pointLight color="#6bd1ca" intensity={blast ? 6 : 0.3} position={[-1.7, 1.8, 1.4]} distance={7} />
    <group ref={group} position={[-0.1, -0.02, 0]}>
      <group ref={surface}>
        {resources.pieces.map(({ geometry }, index) => <mesh key={index} geometry={geometry} material={materials.chrome} />)}
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
  const streakMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: "#73c7c0", transparent: true, opacity: 0 }), []);
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
    <lineSegments ref={threads} geometry={resources.threads}><lineBasicMaterial color="#244548" transparent opacity={0.32} /></lineSegments>
    <lineSegments ref={slivers} geometry={resources.streaks} material={streakMaterial} />
    <points ref={sparks} geometry={resources.dust}><pointsMaterial color="#84d2ca" size={0.009} transparent opacity={0.34} sizeAttenuation /></points>
  </>;
}

export function OrbitCanvas(props: OrbitCanvasProps) {
  return <div aria-hidden="true" className="hero-canvas" style={{ inset: 0 }}>
    <Canvas camera={{ fov: 38, position: [0, 0, 8.2] }} dpr={[1, 1.35]} frameloop={props.reducedMotion || !props.active ? "demand" : "always"} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      <StudioReflections />
      <Suspense fallback={null}><Monogram {...props} /></Suspense>
      <EnergyLines {...props} />
    </Canvas>
  </div>;
}

