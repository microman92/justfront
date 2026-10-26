"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { GalleryRibbon, type GalleryState } from "./gallery-ribbon";

const motionCases = [
  {
    type: "GSAP · АНИМАЦИЯ",
    name: "Sport Center",
    detail: "Адаптивный презентационный сайт с GSAP-анимациями.",
    href: "https://microman92.github.io/sport-center/",
  },
  {
    type: "ИНТЕРАКТИВНОСТЬ · КАЛЬКУЛЯТОР",
    name: "ROKACELL",
    detail: "Технические калькуляторы в B2B-каталоге теплоизоляции.",
    href: "https://www.rokacell.com/ru",
  },
  {
    type: "AI · ЭКСПЕРИМЕНТ",
    name: "BRUT AI",
    detail: "Экспериментальный проект в направлении искусственного интеллекта.",
    href: "https://brut-7lyv.vercel.app/",
  },
];

function subscribeLayout(callback: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener("resize", callback);
  reduced.addEventListener("change", callback);
  return () => {
    window.removeEventListener("resize", callback);
    reduced.removeEventListener("change", callback);
  };
}

export function MotionGallery() {
  const section = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const grid = useRef<HTMLDivElement>(null);
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
          // Ribbon and final tableau share one scene, avoiding a WebGL/DOM swap.
        }
        const cases = grid.current?.querySelectorAll<HTMLElement>(".motion-case");
        if (cases?.length) timeline.fromTo(cases, { autoAlpha: 0, y: 24 }, {
          autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.12, ease: "power2.out",
        }, mode === "mobile" ? 0.5 : 0.52);
        section.current!.querySelectorAll<HTMLElement>(".gallery-exit-stripe").forEach((stripe, index) => {
          const start = mode === "mobile" ? 2 / 3 : 5 / 6.5;
          const duration = (1 - start) / 2;
          timeline.to(stripe, { scaleY: 1, duration, ease: "none" }, start + duration * (4 - index) / 4);
        });
        timeline.set(section.current, { visibility: "hidden" }, 1);
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
    <section aria-labelledby="motion-title" className={`design-motion${animated ? " is-animated" : ""}${mode === "mobile" ? " is-mobile-pinned" : ""}`} id="motion" ref={section}>
      <h2 className="design-motion-title" id="motion-title" ref={title}><span>ДВИЖЕНИЕ</span><span>В ИНТЕРФЕЙСЕ</span></h2>
      <p className="design-motion-intro" ref={introduction}>Анимации, интерактивные элементы и AI-проекты из опубликованных работ.</p>
      {animated && <div aria-hidden="true" className="design-motion-canvas">
        <Canvas camera={{ fov: 52, position: [0, 0, 22] }} dpr={[1, 1.35]} frameloop="demand" gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} onCreated={({ invalidate }) => { state.current.invalidate = invalidate; }}>
          <Suspense fallback={null}><GalleryRibbon state={state} /></Suspense>
        </Canvas>
      </div>}
      <div className="design-motion-grid" ref={grid}>
        {motionCases.map((motionCase, index) => <a aria-label={`Открыть проект ${motionCase.name}`} className="motion-case" href={motionCase.href} key={motionCase.name} rel="noopener noreferrer" target="_blank">
          <span className="motion-case-index">0{index + 1} / {motionCase.type}</span>
          <strong>{motionCase.name}</strong>
          <span className="motion-case-detail">{motionCase.detail}</span>
          <span aria-hidden="true" className="motion-case-arrow">↗</span>
        </a>)}
      </div>
      <div className="design-motion-bottom" ref={bottom}><p>Работы с GSAP, интерактивностью и AI.</p><a className="underlined-link" href="#work">ВСЕ ПРОЕКТЫ <span aria-hidden="true">↑</span></a></div>
      {animated && <div aria-hidden="true" className="gallery-exit-stripes">{Array.from({ length: 5 }, (_, index) => <div className="gallery-exit-stripe" key={index} />)}</div>}
    </section>
  );
}

