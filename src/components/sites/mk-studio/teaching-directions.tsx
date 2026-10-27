"use client";

import { useEffect, useRef } from "react";
import styles from "./teaching-directions.module.css";

const directions = ["Frontend", "AI-разработку", "Старт в IT"] as const;

export function TeachingDirections() {
  const container = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const { default: gsap } = await import("gsap");
      if (disposed || !container.current) return;
      const context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const root = container.current!;
          const words = Array.from(root.querySelectorAll<HTMLElement>("[data-teaching-word]"));
          const glyphs = words.map(word => Array.from(word.querySelectorAll<HTMLElement>("[data-teaching-glyph]")));
          gsap.set(words, { autoAlpha: 0 });
          gsap.set(words[0], { autoAlpha: 1 });
          gsap.set(glyphs.flat(), { yPercent: 110 });
          gsap.set(glyphs[0], { yPercent: 0 });
          const timeline = gsap.timeline({ repeat: -1, paused: true });
          words.forEach((word, index) => {
            const next = (index + 1) % words.length;
            const at = index * 4 + 2.7;
            timeline.to(glyphs[index], { yPercent: -110, duration: 0.35, stagger: 0.018, ease: "power2.in" }, at);
            timeline.set(words[next], { autoAlpha: 1 }, at + 0.16);
            timeline.fromTo(glyphs[next], { yPercent: 110 }, {
              yPercent: 0, duration: 0.45, stagger: 0.025, ease: "power3.out", immediateRender: false,
            }, at + 0.18);
            timeline.set(word, { autoAlpha: 0 }, at + 0.9);
          });
          timeline.to({}, { duration: 0.4 });
          let inView = false;
          const updatePlayback = () => {
            if (inView && !document.hidden) timeline.play();
            else timeline.pause();
          };
          const observer = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            updatePlayback();
          });
          observer.observe(root);
          document.addEventListener("visibilitychange", updatePlayback);
          return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", updatePlayback);
          };
        });
        return () => media.revert();
      }, container.current);
      cleanup = () => context.revert();
    })();
    return () => { disposed = true; cleanup?.(); };
  }, []);

  return <p ref={container} className={styles.line} aria-label="Преподаю Frontend, AI-разработку и Старт в IT в PROWEB">
    <span aria-hidden="true" className={styles.prefix}>Преподаю</span>
    <span aria-hidden="true" className={styles.words}>
      {directions.map(direction => <span className={styles.word} data-teaching-word key={direction}>
        {Array.from(direction).map((character, index) => <span className={styles.cell} key={index}><span className={styles.glyph} data-teaching-glyph>{character === " " ? "\u00a0" : character}</span></span>)}
      </span>)}
    </span>
    <span aria-hidden="true" className={styles.static}>Frontend · AI-разработку · Старт в IT</span>
  </p>;
}
