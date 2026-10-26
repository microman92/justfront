"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type GalleryState = { progress: number; invalidate: (() => void) | null };
const palette = ["#172124", "#334e50", "#a8b9b7", "#5e7275", "#c4cfcd", "#263336"];

function makeStudyTexture(index: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 568;
  canvas.height = 812;
  const context = canvas.getContext("2d")!;
  const background = context.createLinearGradient(0, 0, 568, 812);
  background.addColorStop(0, palette[index % palette.length]);
  background.addColorStop(1, index % 2 ? "#0c1113" : "#222c2f");
  context.fillStyle = background;
  context.fillRect(0, 0, 568, 812);
  context.strokeStyle = "rgba(220,238,235,.12)";
  context.lineWidth = 1;
  for (let x = 32; x < 568; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 812);
    context.stroke();
  }
  for (let y = 28; y < 812; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(568, y);
    context.stroke();
  }
  context.save();
  context.translate(284, 376);
  context.rotate((index - 4) * 0.08);
  context.strokeStyle = "rgba(180,220,215,.78)";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(0, 0, 112 + index % 3 * 18, -0.8 + index * 0.12, 4.1 + index * 0.08);
  context.stroke();
  context.strokeStyle = "rgba(220,238,235,.48)";
  context.beginPath();
  context.arc(0, 0, 72 + index % 2 * 12, 0.3, Math.PI * 1.65);
  context.stroke();
  context.fillStyle = "rgba(14,22,24,.7)";
  context.fillRect(-88, -56, 176, 112);
  context.strokeStyle = "rgba(195,220,216,.82)";
  context.strokeRect(-88, -56, 176, 112);
  context.fillStyle = "#d6e3e0";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "500 44px Arial, sans-serif";
  context.fillText("JF", 0, 1);
  context.restore();
  context.fillStyle = "rgba(225,239,236,.8)";
  context.font = "12px Consolas, monospace";
  context.fillText("JUSTFRONT / MOTION 0" + (index + 1), 28, 44);
  context.fillStyle = "rgba(225,239,236,.52)";
  context.fillText("ФОРМА / СВЕТ / ДВИЖЕНИЕ", 28, 774);
  return new THREE.CanvasTexture(canvas);
}
const slope = 28 / (Math.PI * 4);
const pathScale = Math.sqrt(144 + slope * slope);
const pathLength = Math.PI * 4 * pathScale;
const imageRun = 8 * 6.2 + 5.8;
const gridStart = (pathLength * 0.5 + imageRun + 10) / (pathLength + imageRun) * (2 / 3);

// Write a ribbon vertex without allocating vectors in the animation loop.
function writeVertex(array: Float32Array, index: number, angle: number, offset: number) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const dip = (angle - Math.PI * 2) / 2;
  const bump = 2.5 * Math.exp(-dip * dip);
  let nx = (slope + dip * bump) * sin;
  let ny = 12;
  let nz = -(slope + dip * bump) * cos;
  const firstLength = Math.hypot(nx, ny, nz);
  nx /= firstLength; ny = ny / firstLength + 0.6; nz /= firstLength;
  const length = Math.hypot(nx, ny, nz);
  array[index] = 12 * cos + nx / length * offset;
  array[index + 1] = -16 + angle * slope - bump + ny / length * offset;
  array[index + 2] = 12 * sin + nz / length * offset;
}

export function GalleryRibbon({ state }: { state: React.RefObject<GalleryState> }) {
  const group = useRef<THREE.Group>(null);
  const textures = useMemo(() => Array.from({ length: 9 }, (_, index) => makeStudyTexture(index)), []);
  const { size, invalidate, camera } = useThree();
  const compact = size.width < 768;
  const tablet = size.width >= 768 && size.width < 1200;
  const distance = compact ? 28 : tablet ? 24 : 22;
  const fov = compact ? 58 : tablet ? 54 : 52;
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.position.z = distance;
      camera.updateProjectionMatrix();
      invalidate();
    }
  }, [camera, distance, fov, invalidate]);
  const resources = useMemo(() => {
    const ribbon = Array.from({ length: 9 }, () => new THREE.PlaneGeometry(1, 1, 116, 1));
    const grid = Array.from({ length: 6 }, () => new THREE.PlaneGeometry(1, 1, 20, 12));
    const guides = [-1, 1].map(side => {
      const positions = new Float32Array(601 * 3);
      for (let index = 0; index <= 600; index++) writeVertex(positions, index * 3, index / 600 * Math.PI * 4, side * 2.5);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      return geometry;
    });
    const guideMaterial = new THREE.LineBasicMaterial({ color: "#9e9e9e", transparent: true, opacity: 0.65 });
    const guideLines = guides.map(geometry => new THREE.Line(geometry, guideMaterial));
    return { ribbon, grid, guides, guideMaterial, guideLines };
  }, []);
  useEffect(() => {
    textures.forEach(texture => { texture.colorSpace = THREE.SRGBColorSpace; texture.generateMipmaps = false; texture.minFilter = THREE.LinearFilter; });
    invalidate();
    return () => {
      [...resources.ribbon, ...resources.grid, ...resources.guides].forEach(geometry => geometry.dispose());
      resources.guideMaterial.dispose();
      textures.forEach(texture => texture.dispose());
    };
  }, [invalidate, resources, textures]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const progress = Math.min(1, state.current.progress / (compact ? 3 / 4.5 : 5 / 6.5));
    const ribbonProgress = Math.min(1, progress / (2 / 3));
    const offset = ribbonProgress * (pathLength + imageRun) - imageRun + 25;
    let movingHover = false;
    for (let index = 0; index < 9; index++) {
      const mesh = group.current.children[index] as THREE.Mesh;
      const distance = offset + index * 6.2;
      mesh.visible = ribbonProgress < 1 && distance > 0 && distance < pathLength;
      if (!mesh.visible) continue;
      const desired = mesh.userData.hover ? 1.12 : 1;
      const hover = mesh.userData.scale ?? 1;
      const scale = hover + (desired - hover) * (1 - Math.exp(-delta * 7));
      mesh.userData.scale = scale;
      movingHover ||= Math.abs(scale - desired) > 0.001;
      const positions = resources.ribbon[index].attributes.position;
      const array = positions.array as Float32Array;
      const uv = resources.ribbon[index].attributes.uv;
      for (let segment = 0; segment <= 116; segment++) {
        const angle = (distance + 2.9 - 2.9 * scale + segment / 116 * 5.8 * scale) / pathScale;
        for (let row = 0; row < 2; row++) {
          const vertex = row * 117 + segment;
          writeVertex(array, vertex * 3, angle, (row - 0.5) * 5.8 * (568 / 812) * scale);
          uv.setXY(vertex, segment / 116, row);
        }
      }
      positions.needsUpdate = true;
      uv.needsUpdate = true;
    }
    const gridProgress = THREE.MathUtils.clamp((progress - gridStart) / (1 - gridStart), 0, 1);
    resources.guideMaterial.opacity = 0.65 * Math.max(0, 1 - gridProgress / 0.2);
    const halfHeight = Math.tan(fov * Math.PI / 360) * distance;
    const halfWidth = halfHeight * size.width / size.height;
    const columns = compact ? 2 : 3, rows = compact ? 3 : 2;
    const gapX = compact ? 0.18 : tablet ? 0.28 : size.width >= 1440 ? 0.5 : 0.38;
    const gapY = compact ? 0.22 : tablet ? 0.36 : size.width >= 1440 ? 0.7 : 0.55;
    const widthFraction = compact ? 0.88 : tablet ? 0.84 : 0.78;
    const heightFraction = compact || tablet ? 0.82 : 0.78;
    const width = Math.min((halfWidth * 2 * widthFraction - gapX * (columns - 1)) / columns, (halfHeight * 2 * heightFraction - gapY * (rows - 1)) / rows / (568 / 812), compact ? 99 : tablet ? 8.5 : 9.2);
    const height = width * (568 / 812);
    for (let index = 0; index < 6; index++) {
      const mesh = group.current.children[9 + index] as THREE.Mesh;
      const phase = THREE.MathUtils.clamp((gridProgress - index * 0.08) / 0.4, 0, 1);
      mesh.visible = phase > 0;
      if (!mesh.visible) continue;
      const ease = 1 - Math.pow(1 - phase, 3);
      const column = index % columns, row = Math.floor(index / columns);
      const x = (column - (columns - 1) / 2) * (width + gapX);
      const y = ((rows - 1) / 2 - row) * (height + gapY);
      const fromX = column === 0 ? -halfWidth - 2 * width : column === columns - 1 ? halfWidth + 2 * width : x;
      const fromY = (row === 0 ? 1 : -1) * (halfHeight + 2 * height);
      mesh.position.set(THREE.MathUtils.lerp(fromX, x, ease), THREE.MathUtils.lerp(fromY, y, ease), 0);
      mesh.scale.set(width, height, 1);
      const positions = resources.grid[index].attributes.position;
      for (let vertex = 0; vertex < positions.count; vertex++) {
        const u = vertex % 21 / 20, v = Math.floor(vertex / 21) / 12;
        const wave = (1 - phase) * Math.sin((u + v) * Math.PI - phase * 6) * 0.12;
        positions.setZ(vertex, wave);
      }
      positions.needsUpdate = true;
    }
    for (let index = 0; index < 2; index++) resources.guides[index].setDrawRange(0, Math.round(ribbonProgress * 601));
    if (movingHover) invalidate();
  });
  const gridTextures = [0, 1, 4, 2, 7, 6];
  return <group ref={group}>
    {resources.ribbon.map((geometry, index) => <mesh key={`ribbon-${index}`} geometry={geometry} frustumCulled={false} onPointerOver={(event) => { event.object.userData.hover = true; invalidate(); }} onPointerOut={(event) => { event.object.userData.hover = false; invalidate(); }}>
      <shaderMaterial uniforms={{ map: { value: textures[8 - index] } }} side={THREE.DoubleSide} toneMapped={false}
        vertexShader="varying vec2 ribbonUv; void main(){ ribbonUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }"
        fragmentShader={"uniform sampler2D map; varying vec2 ribbonUv; void main(){ vec2 uv=ribbonUv; if(gl_FrontFacing) uv.x=1.0-uv.x; gl_FragColor=texture2D(map,uv);\n#include <colorspace_fragment>\n}"} />
    </mesh>)}
    {resources.grid.map((geometry, index) => <mesh key={`grid-${index}`} geometry={geometry} frustumCulled={false}>
      <meshBasicMaterial map={textures[gridTextures[index]]} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>)}
    {resources.guideLines.map((line, index) => <primitive key={index} object={line} />)}
  </group>;
}
