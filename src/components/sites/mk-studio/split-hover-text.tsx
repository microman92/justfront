"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./split-hover-text.module.css";

export function SplitHoverText({ children }: { children: ReactNode }) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const text = textRef.current;
    const trigger = text?.closest<HTMLElement>("a, button") ?? text;
    if (!text || !trigger || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let removeListeners = () => {};

    const setup = async () => {
      const [{ default: gsap }, { SplitText }] = await Promise.all([
        import("gsap"),
        import("gsap/SplitText"),
      ]);
      await document.fonts.ready;
      if (disposed) return;

      gsap.registerPlugin(SplitText);
      const context = gsap.context(() => {}, trigger);
      let split: InstanceType<typeof SplitText> | null = null;

      const animate = () => {
        context.add(() => {
          split ??= SplitText.create(text, {
            type: "chars, words",
            charsClass: "split-hover-char",
            wordsClass: "split-hover-word",
            aria: "auto",
          });

          gsap.killTweensOf(split.chars);
          gsap.fromTo(
            split.chars,
            {
              autoAlpha: 0,
              scale: 0.72,
              y: 14,
              rotationX: -75,
              transformOrigin: "50% 50% -10px",
            },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              rotationX: 0,
              duration: 0.52,
              ease: "back.out(1.45)",
              stagger: 0.018,
              overwrite: true,
            },
          );
        });
      };

      trigger.addEventListener("pointerenter", animate);
      trigger.addEventListener("focus", animate);
      removeListeners = () => {
        trigger.removeEventListener("pointerenter", animate);
        trigger.removeEventListener("focus", animate);
        split?.revert();
        context.revert();
      };

      if (disposed) removeListeners();
    };

    void setup();
    return () => {
      disposed = true;
      removeListeners();
    };
  }, []);

  return <span className={`${styles.target} split-hover-text`} ref={textRef}>{children}</span>;
}
