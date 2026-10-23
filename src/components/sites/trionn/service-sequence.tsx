"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 371;
const frameUrl = (frame: number, width: number) => `/sites/trionn/stone-${width}/frame_${String(frame).padStart(4, "0")}.webp`;

/** The source's stone is a rendered image sequence, controlled by scroll. */
export function ServiceSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest<HTMLElement>(".services-section");
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !section || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const cacheLimit = mobile.matches ? 24 : 40;
    const bitmapWidth = mobile.matches ? 640 : 960;
    const frames = new Map<number, ImageBitmap>();
    const sources = new Map<number, Promise<Blob>>();
    const downloadController = new AbortController();
    const pending = new Map<number, AbortController>();
    const failed = new Set<number>();
    let queue: number[] = [];
    let targetFrame = 1;
    let lastFrame = 0;
    let nearScene = false;
    let disposed = false;
    let animationFrame = 0;
    let motionFrame = 0;
    let targetProgress = 0;
    let displayedProgress = 0;
    let lastMotionTime = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let lastDrawWidth = 0;
    let lastDrawHeight = 0;
    let trigger: import("gsap/ScrollTrigger").ScrollTrigger | undefined;
    const intro = section.querySelector<HTMLElement>(".service-intro-words");
    const letters = [...section.querySelectorAll<HTMLElement>(".service-intro-letter")];
    const stripes = [...section.querySelectorAll<HTMLElement>(".service-exit-stripe")];
    const desktopCards = [...section.querySelectorAll<HTMLElement>(".service-desktop-list .service-row")];
    const mobileCards = [...section.querySelectorAll<HTMLElement>(".service-mobile-list .service-row")];

    const draw = () => {
      animationFrame = 0;
      if (disposed || !frames.size) return;
      const frame = frames.has(targetFrame)
        ? targetFrame
        : [...frames.keys()].reduce((nearest, current) => Math.abs(current - targetFrame) < Math.abs(nearest - targetFrame) ? current : nearest);
      const bitmap = frames.get(frame);
      if (!bitmap) return;
      const width = canvasWidth;
      const height = canvasHeight;
      if (!width || !height || (frame === lastFrame && width === lastDrawWidth && height === lastDrawHeight)) return;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.clearRect(0, 0, width, height);
      // The landscape render extends beyond the narrow mobile viewport.
      const renderHeight = height * (mobile.matches ? 0.78 : 0.94);
      const renderWidth = renderHeight * bitmap.width / bitmap.height;
      context.drawImage(bitmap, (width - renderWidth) / 2, (height - renderHeight) / 2, renderWidth, renderHeight);
      canvas.dataset.frame = String(frame);
      lastFrame = frame;
      lastDrawWidth = width;
      lastDrawHeight = height;
    };

    const scheduleDraw = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(draw);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvasWidth = Math.round(canvas.clientWidth * dpr);
      canvasHeight = Math.round(canvas.clientHeight * dpr);
      scheduleDraw();
    };
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    const getSource = (frame: number) => {
      let source = sources.get(frame);
      if (!source) {
        source = fetch(frameUrl(frame, bitmapWidth), { signal: downloadController.signal }).then(response => {
          if (!response.ok) throw new Error(`Stone frame ${frame}: ${response.status}`);
          return response.blob();
        });
        sources.set(frame, source);
      }
      return source;
    };
    // Keep compressed frames ready before the scene; decoded memory stays bounded.
    const preloadSources = async () => {
      for (let start = 1; start <= FRAME_COUNT && !disposed; start += 4) {
        await Promise.allSettled(Array.from({ length: Math.min(4, FRAME_COUNT - start + 1) }, (_, offset) => getSource(start + offset)));
        await new Promise(resolve => setTimeout(resolve, 24));
      }
    };
    const preloadTimer = window.setTimeout(() => { void preloadSources(); }, 1200);

    const trimCache = () => {
      if (frames.size <= cacheLimit) return;
      const farthest = [...frames.keys()].sort((a, b) => Math.abs(b - targetFrame) - Math.abs(a - targetFrame));
      for (const frame of farthest) {
        if (frames.size <= cacheLimit) break;
        if (frame === lastFrame || frame === targetFrame) continue;
        frames.get(frame)?.close();
        frames.delete(frame);
      }
    };

    const pump = () => {
      if (disposed || !nearScene) return;
      while (pending.size < 3 && queue.length) {
        const frame = queue.shift()!;
        if (frames.has(frame) || pending.has(frame) || failed.has(frame)) continue;
        const controller = new AbortController();
        pending.set(frame, controller);
        void (async () => {
          try {
            const source = await getSource(frame);
            if (disposed || controller.signal.aborted) return;
            const bitmap = await createImageBitmap(source);
            if (disposed || controller.signal.aborted) { bitmap.close(); return; }
            frames.set(frame, bitmap);
            trimCache();
            scheduleDraw();
          } catch {
            if (!controller.signal.aborted) failed.add(frame);
          } finally {
            pending.delete(frame);
            pump();
          }
        })();
      }
    };

    const requestFrame = (frame: number) => {
      targetFrame = Math.max(1, Math.min(FRAME_COUNT, frame));
      // Give current frames priority over requests left behind by a fast scroll.
      pending.forEach((controller, index) => {
        if (Math.abs(index - targetFrame) > cacheLimit / 2) controller.abort();
      });
      queue = [targetFrame];
      if (!reducedMotion.matches) {
        for (let offset = 1; offset <= (mobile.matches ? 5 : 10); offset++) {
          if (targetFrame + offset <= FRAME_COUNT) queue.push(targetFrame + offset);
          if (targetFrame - offset > 0) queue.push(targetFrame - offset);
        }
      }
      pump();
      scheduleDraw();
    };

    const updateScene = (outerProgress: number) => {
      // Keep the stone and exit phases at 80/20 of the shortened scene travel.
      const progress = Math.min(1, outerProgress * 1.25);
      const clamp = (value: number) => Math.max(0, Math.min(1, value));
      const exitProgress = clamp((outerProgress - 0.8) / 0.2);
      stripes.forEach((stripe, index) => {
        stripe.style.transform = `scaleY(${clamp(exitProgress * 2 - (4 - index) * 0.25)})`;
      });
      const stoneProgress = mobile.matches ? clamp((progress - 0.15) / 0.85) : progress;
      requestFrame(Math.round(stoneProgress * (FRAME_COUNT - 1)) + 1);
      const scatter = clamp((progress - 0.35) / 0.18);
      if (intro) intro.style.opacity = String(1 - clamp((progress - 0.38) / 0.15));
      letters.forEach((letter, index) => {
        const angle = index * 2.39996;
        const distance = 120 + (index % 7) * 75;
        letter.style.transform = `translate3d(${Math.cos(angle) * distance * scatter}px, ${Math.sin(angle) * distance * scatter}px, 0) rotate(${(index % 2 ? -1 : 1) * scatter * (35 + index % 6 * 18)}deg)`;
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
      section.style.setProperty("--intro-color", `rgb(${textChannel} ${textChannel} ${textChannel})`);
      const cardProgress = clamp((progress - 0.56) / 0.44);
      const cardPhase = cardProgress * 3;
      desktopCards.forEach((label, index) => {
        const phase = clamp((cardProgress * 0.85 - Math.floor(index / 2) * 0.2) / 0.45);
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
        label.style.setProperty("--service-x", `${startX + bend * (endX - startX)}px`);
        label.style.setProperty("--service-y", `${y}px`);
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
        requestFrame(200);
        section.style.setProperty("--stone-opacity", "1");
        section.style.setProperty("--smoke-opacity", "0.2");
        section.querySelector<HTMLElement>(".service-intro-words")?.style.setProperty("display", "none");
        section.querySelectorAll<HTMLElement>(".service-row").forEach((label) => {
          label.style.removeProperty("--service-offset");
          label.style.removeProperty("--service-opacity");
        });
        return;
      }
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

    const observer = new IntersectionObserver(([entry]) => {
      nearScene = entry.isIntersecting;
      if (nearScene) pump();
      else {
        pending.forEach((controller) => controller.abort());
        frames.forEach((bitmap, frame) => { if (frame !== lastFrame) { bitmap.close(); frames.delete(frame); } });
      }
    }, { rootMargin: "100% 0px" });
    observer.observe(section);
    void configureMotion();
    const onMotionChange = () => { void configureMotion(); };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      disposed = true;
      observer.disconnect();
      resizeObserver.disconnect();
      window.clearTimeout(preloadTimer);
      downloadController.abort();
      trigger?.kill();
      reducedMotion.removeEventListener("change", onMotionChange);
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(motionFrame);
      pending.forEach((controller) => controller.abort());
      frames.forEach((bitmap) => bitmap.close());
    };
  }, []);

  return <canvas aria-hidden="true" className="service-sequence-canvas" ref={canvasRef} />;
}
