import type Lenis from "lenis";

let activeLenis: Lenis | null = null;
let backgroundScrollLocked = false;

export function registerSmoothScroll(instance: Lenis) {
  activeLenis = instance;
  if (backgroundScrollLocked) instance.stop();
  return () => {
    if (activeLenis === instance) activeLenis = null;
  };
}

export function setBackgroundScrollLocked(locked: boolean) {
  backgroundScrollLocked = locked;
  if (!activeLenis) return;
  if (locked) activeLenis.stop();
  else activeLenis.start();
}

export function scrollToSection(target: HTMLElement) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (activeLenis && !reducedMotion) {
    activeLenis.scrollTo(target, {
      duration: 1.3,
      easing: (progress) => 1 - Math.pow(1 - progress, 3),
    });
    return;
  }

  target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
}
