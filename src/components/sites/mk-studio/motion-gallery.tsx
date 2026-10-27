"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { GalleryRibbon, type GalleryState } from "./gallery-ribbon";
import type { Project } from "./content";
import { ProjectDetails } from "./project-details";

function subscribeLayout(callback: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener("resize", callback);
  reduced.addEventListener("change", callback);
  return () => {
    window.removeEventListener("resize", callback);
    reduced.removeEventListener("change", callback);
  };
}

export function MotionGallery({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const introduction = useRef<HTMLParagraphElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const state = useRef<GalleryState>({ progress: 0, invalidate: null });
  const mode = useSyncExternalStore(subscribeLayout, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "static" : window.innerWidth > 767 ? "desktop" : "mobile", () => "static");
  const animated = mode !== "static";

  useEffect(() => {
    if (!animated || !section.current) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        state.current.progress = 0;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (mode === "mobile" ? 4.5 : 6.5)}`,
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
        if (mode === "mobile") {
          timeline.to(state.current, { progress: 1, duration: 1, ease: "none", onUpdate: () => state.current.invalidate?.() }, 0);
          timeline.to(title.current, { xPercent: -110, opacity: 0, duration: 0.25, ease: "none" }, 0.08);
          timeline.to(introduction.current, { opacity: 0, duration: 0.15, ease: "none" }, 0.1);
          timeline.fromTo(bottom.current, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "none" }, 0.65);
        } else {
          timeline.to(state.current, { progress: 1, duration: 1, ease: "none", onUpdate: () => state.current.invalidate?.() }, 0);
          const titleLines = title.current?.querySelectorAll("span");
          if (titleLines?.length === 2) {
            timeline.fromTo(titleLines[0], { x: -window.innerWidth * 0.65 }, { x: window.innerWidth, ease: "none", duration: 0.43 }, 0);
            timeline.fromTo(titleLines[1], { x: window.innerWidth * 0.65 }, { x: -window.innerWidth, ease: "none", duration: 0.43 }, 0);
          }
          timeline.to(title.current, { opacity: 0, ease: "none", duration: 0.15 }, 0.36);
          timeline.to(introduction.current, { opacity: 0, duration: 0.12, ease: "none" }, 0.11);
        }

      }, section.current);
      cleanup = () => context.revert();
      ScrollTrigger.refresh();
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [animated, mode]);

  return (
    <div id="work">
    <section aria-labelledby="motion-title" className={`design-motion${animated ? " is-animated" : ""}${mode === "mobile" ? " is-mobile-pinned" : ""}`} ref={section}>
      <h2 className="design-motion-title" id="motion-title" ref={title}><span>МОИ</span><span>ПРОЕКТЫ</span></h2>
      <p className="design-motion-intro" ref={introduction}>Сайты, веб-приложения и эксперименты: от задачи до работающего продукта.</p>
      {animated && <div aria-hidden="true" className="design-motion-canvas">
        <Canvas camera={{ fov: 52, position: [0, 0, 22] }} dpr={[1, 1.35]} frameloop="demand" gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} onCreated={({ invalidate }) => { state.current.invalidate = invalidate; }}>
          <Suspense fallback={null}><GalleryRibbon state={state} projects={projects} /></Suspense>
        </Canvas>
      </div>}
      <div className="design-motion-bottom" ref={bottom}><p>Сколько проектов, столько и решений.</p><span>ЛИСТАЙТЕ ДАЛЬШЕ ↓</span></div>
    </section>
    <ProjectDetails projects={projects} />
    </div>
  );
}

