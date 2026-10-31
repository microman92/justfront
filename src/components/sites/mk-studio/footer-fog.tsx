"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uAspect;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
  }
  float fog(vec2 p) {
    float value = noise(p) * 0.55;
    value += noise(p * 2.03 + 4.1) * 0.27;
    value += noise(p * 4.07 - 2.7) * 0.13;
    value += noise(p * 8.11 + 8.2) * 0.05;
    return value;
  }
  void main() {
    vec2 p = vec2(vUv.x * uAspect, vUv.y);
    float t = uTime * 0.09;
    float drift = fog(p * 2.0 + vec2(-t, -t * 0.35));
    float clouds = fog(p * 3.0 + vec2(-t * 1.5, t * 0.3) + drift * 0.8);
    float density = smoothstep(0.37, 0.72, clouds * 0.7 + drift * 0.3);
    float heightFade = 1.0 - smoothstep(0.28, 0.98, vUv.y);
    float edge = smoothstep(0.0, 0.18, vUv.x) * (1.0 - smoothstep(0.82, 1.0, vUv.x));
    vec3 color = mix(vec3(0.08, 0.25, 0.25), vec3(0.30, 0.59, 0.54), drift);
    gl_FragColor = vec4(color, density * heightFade * edge * 0.34);
    #include <colorspace_fragment>
  }
`;

export function FooterFog() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" }); }
    catch { return; }

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, transparent: true, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uAspect: { value: 1 } },
    });
    scene.add(new THREE.Mesh(geometry, material));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let elapsed = 0;
    let previous = 0;

    const draw = (now: number) => {
      frame = 0;
      if (!visible || document.hidden) { previous = 0; return; }
      if (!reduced.matches && previous) elapsed += Math.min((now - previous) / 1000, 0.05);
      previous = now;
      material.uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      if (!reduced.matches) frame = requestAnimationFrame(draw);
    };
    const schedule = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); };
    const resize = () => {
      const width = canvas.clientWidth, height = canvas.clientHeight;
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1) * 0.5);
      renderer.setSize(width, height, false);
      material.uniforms.uAspect.value = width / height;
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; previous = 0; }
      else schedule();
    });
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", schedule);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", schedule);
      geometry.dispose(); material.dispose(); renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="footer-fog" aria-hidden="true" />;
}
