"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { HeroExperience } from "./hero-experience";
import { VisionScene } from "./intro-scenes";

const OrbitCanvas = dynamic(() => import("./orbit-canvas").then((module) => module.OrbitCanvas), {
  ssr: false,
});

export function IntroSequence({ children }: { children: React.ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvasAnchor = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scrollPosition = useRef(0);
  const blastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [blast, setBlast] = useState(false);
  const [active, setActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    let sequenceTop = 0;
    let sequenceHeight = window.innerHeight * 3.2;
    const updateScroll = () => {
      scrollPosition.current = Math.max(0, (window.scrollY - sequenceTop) / window.innerHeight);
      if (canvasAnchor.current) {
        // The source mark fades through the opening service overview and approach scene.
        const sequenceLength = sequenceHeight / window.innerHeight;
        const fadeEnd = Math.min(3.2, sequenceLength - 0.12);
        const fade = (fadeEnd - scrollPosition.current) / 0.8;
        const opacity = String(Math.min(1, Math.max(0, fade)));
        if (canvasAnchor.current.style.opacity !== opacity) canvasAnchor.current.style.opacity = opacity;
      }
    };
    const measure = () => {
      if (wrapper.current) {
        sequenceTop = window.scrollY + wrapper.current.getBoundingClientRect().top;
        sequenceHeight = wrapper.current.offsetHeight;
      }
      updateScroll();
    };
    updateMotion();
    measure();
    media.addEventListener("change", updateMotion);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", measure);
    const resizeObserver = new ResizeObserver(measure);
    if (wrapper.current) resizeObserver.observe(wrapper.current);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    if (wrapper.current) observer.observe(wrapper.current);
    return () => {
      media.removeEventListener("change", updateMotion);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", measure);
      resizeObserver.disconnect();
      observer.disconnect();
      if (blastTimer.current) clearTimeout(blastTimer.current);
    };
  }, []);

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !(event.target as HTMLElement).closest(".hero-section")) return;
    pointer.current.x = event.clientX / window.innerWidth * 2 - 1;
    pointer.current.y = event.clientY / window.innerHeight * 2 - 1;
  };

  const stopBlast = () => {
    if (blastTimer.current) clearTimeout(blastTimer.current);
    blastTimer.current = null;
    setBlast(false);
  };

  return <div
    className="intro-sequence"
    onPointerMove={updatePointer}
    onPointerDown={(event) => {
      if (!(event.target as HTMLElement).closest(".hero-section")) return;
      if ((event.target as HTMLElement).closest("a, button")) return;
      if (scrollPosition.current >= 0.24) return;
      updatePointer(event);
      stopBlast();
      blastTimer.current = setTimeout(() => {
        setBlast(true);
        blastTimer.current = null;
      }, 500);
    }}
    onPointerUp={stopBlast}
    onPointerCancel={stopBlast}
    onPointerLeave={stopBlast}
    ref={wrapper}
  >
    <div aria-hidden="true" className="intro-canvas-anchor" ref={canvasAnchor}>
      <OrbitCanvas active={active} blast={blast} pointer={pointer} reducedMotion={reducedMotion} scrollPosition={scrollPosition} />
    </div>
    <HeroExperience />
    {children}
    <VisionScene />
  </div>;
}
