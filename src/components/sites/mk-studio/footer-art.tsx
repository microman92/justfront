"use client";

import { useEffect, useRef } from "react";

export function FooterArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;
    const footer = canvas.closest("footer")!;
    const mask = document.createElement("canvas");
    const maskContext = mask.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let visible = false;
    let disposed = false;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(devicePixelRatio, 1.35);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      mask.width = canvas.width;
      mask.height = canvas.height;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      maskContext.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontSize = Math.min(width * 0.17, height * 0.68, 260);
      maskContext.clearRect(0, 0, width, height);
      maskContext.font = `650 ${fontSize}px "Segoe UI Variable Display", "Segoe UI", Arial, sans-serif`;
      maskContext.textAlign = "center";
      maskContext.textBaseline = "middle";
      maskContext.fillStyle = "#fff";
      maskContext.fillText("JustFront", width / 2, height * 0.62, width - 32);
      restart();
    };

    const draw = (time: number) => {
      frame = 0;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1.15;
      context.strokeStyle = "rgba(122, 202, 197, .72)";

      for (let y = 0; y < height; y += 5) {
        context.beginPath();
        for (let x = 0; x <= width; x += 12) {
          const pointerWave = reduced.matches
            ? 0
            : Math.exp(-Math.abs(x - pointer.x) / 100 - Math.abs(y - pointer.y) / 22) * 10;
          const wave = reduced.matches
            ? 0
            : Math.sin(x * 0.008 + y * 0.021 + time * 0.00055) * 2 + pointerWave;
          if (x === 0) context.moveTo(x, y + wave);
          else context.lineTo(x, y + wave);
        }
        context.stroke();
      }

      context.globalCompositeOperation = "destination-in";
      context.drawImage(mask, 0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };
    const leave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restart();
    });

    observer.observe(canvas);
    void document.fonts.ready.then(() => { if (!disposed) resize(); });
    window.addEventListener("resize", resize);
    footer.addEventListener("pointermove", move);
    footer.addEventListener("pointerleave", leave);
    reduced.addEventListener("change", restart);
    document.addEventListener("visibilitychange", restart);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      footer.removeEventListener("pointermove", move);
      footer.removeEventListener("pointerleave", leave);
      reduced.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", restart);
    };
  }, []);

  return <canvas aria-hidden="true" className="footer-art" ref={canvasRef} />;
}
