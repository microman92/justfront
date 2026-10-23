"use client";

import { useEffect, useRef } from "react";

type Stroke = { x: number; y: number; end: number; amplitude: number; phase: number };

export function FooterArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;
    const footer = canvas.closest("footer")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let strokes: Stroke[] = [];
    let sourceStrokes: { x: number; y: number; end: number }[] = [];
    let hovered = -1;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let disposed = false;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(devicePixelRatio, 1.35);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = Math.min(width / 1728, height / 441);
      const offsetX = (width - 1728 * scale) / 2;
      const offsetY = height - 441 * scale;
      strokes = sourceStrokes.map(stroke => ({ x: offsetX + stroke.x * scale, end: offsetX + stroke.end * scale, y: offsetY + stroke.y * scale, amplitude: 0, phase: 0 }));
    };

    const draw = (time: number) => {
      frame = 0;
      context.clearRect(0, 0, width, height);
      if (!reduced.matches) {
        for (let index = 0; index < 4; index++) {
          const x = width * (index / 3) + Math.sin(time * 0.00013 + index) * width * 0.08;
          const y = height * 0.65 + Math.sin(time * 0.0002 + index * 2) * height * 0.2;
          const radius = Math.max(width * 0.18, 90);
          const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, "rgba(94,103,119,.12)");
          gradient.addColorStop(1, "rgba(94,103,119,0)");
          context.fillStyle = gradient;
          context.fillRect(0, 0, width, height);
        }
      }
      context.lineWidth = 0.7;
      for (const stroke of strokes) {
        const elapsed = Math.max(0, (time - stroke.phase) / 1000);
        const amplitude = reduced.matches ? 0 : stroke.amplitude * Math.exp(-elapsed * 7.5);
        context.strokeStyle = "rgba(216,216,216,.75)";
        context.beginPath();
        for (let index = 0; index <= 36; index++) {
          const progress = index / 36;
          const x = stroke.x + (stroke.end - stroke.x) * progress;
          const y = stroke.y + Math.sin(progress * Math.PI) * Math.sin(progress * Math.PI * 4.4 - elapsed * 18) * amplitude;
          if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
      }
      if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(draw);
    };
    const restart = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw); };
    const onResize = () => { resize(); restart(); };
    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      const index = strokes.findIndex(stroke => Math.abs(stroke.y - pointer.y) < 9 && pointer.x >= Math.min(stroke.x, stroke.end) && pointer.x <= Math.max(stroke.x, stroke.end));
      if (index >= 0 && index !== hovered) { strokes[index].amplitude = 7; strokes[index].phase = performance.now(); }
      hovered = index;
    };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; hovered = -1; };
    const click = () => { if (hovered >= 0) { strokes[hovered].amplitude = 11; strokes[hovered].phase = performance.now(); } };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); });
    observer.observe(canvas);
    void document.fonts.ready.then(() => { if (!disposed) onResize(); });
    const sourceController = new AbortController();
    void fetch("/sites/trionn/footer-lines.svg", { signal: sourceController.signal }).then(response => response.text()).then(source => {
      if (disposed) return;
      const svg = new DOMParser().parseFromString(source, "image/svg+xml");
      sourceStrokes = [...svg.querySelectorAll("path")].flatMap(path => {
        const match = path.getAttribute("d")?.match(/^M\s*([\d.-]+)[ ,]+([\d.-]+)\s*H\s*([\d.-]+)\s*$/i);
        return match ? [{ x: Number(match[1]), y: Number(match[2]), end: Number(match[3]) }] : [];
      });
      onResize();
    }).catch(() => undefined);
    window.addEventListener("resize", onResize);
    footer.addEventListener("pointermove", move);
    footer.addEventListener("pointerleave", leave);
    footer.addEventListener("click", click);
    reduced.addEventListener("change", restart);
    document.addEventListener("visibilitychange", restart);
    return () => {
      disposed = true;
      sourceController.abort();
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      footer.removeEventListener("pointermove", move);
      footer.removeEventListener("pointerleave", leave);
      footer.removeEventListener("click", click);
      reduced.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", restart);
    };
  }, []);
  return <canvas aria-hidden="true" className="footer-art" ref={canvasRef} />;
}

