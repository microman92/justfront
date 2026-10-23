"use client";

import { useEffect } from "react";

export function SiteMotion({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || window.matchMedia("(max-width: 767px)").matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ autoRaf: false, smoothWheel: true, syncTouch: false });
      const tick = (time: number) => lenis.raf(time * 1000);
      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.off("scroll", onScroll);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    })();
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return children;
}
