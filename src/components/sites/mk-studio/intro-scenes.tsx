"use client";

import { useEffect, useRef } from "react";
const statement = "Разрабатываю сайты и веб-приложения, интегрирую AI в рабочие процессы бизнеса.";

export function AboutScene() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(section.current!.querySelectorAll(".about-word"), { opacity: 0.13 }, {
          opacity: 1, stagger: 0.08, ease: "none",
          scrollTrigger: { trigger: section.current, start: "top 75%", end: "top 5%", scrub: true },
        });
      }, section.current);
      cleanup = () => media.revert();
    })();
    return () => { cancelled = true; cleanup?.(); };
  }, []);
  return <section aria-labelledby="about-title" className="about-section" id="about" ref={section}>
    <div className="about-head"><p className="eyebrow">МИХАИЛ КУДРИЦКИЙ · FRONTEND И AI</p><h2 id="about-title" aria-label={statement}><span aria-hidden="true">{statement.split(" ").map((word, index) => <span className="about-word" key={index}>{word}{" "}</span>)}</span></h2></div>
    <div className="about-bottom"><p className="about-principle">PROWEB.<br />FRONTEND → AI.<br />300+ УЧЕНИКОВ.</p><div className="about-aside"><p>Преподаватель PROWEB с 2021 года. Преподавал Frontend, сейчас веду AI-направления. Коммерчески разрабатываю сайты и приложения с 2023 года.</p><a className="underlined-link" href="#contact">ОБСУДИТЬ ЗАДАЧУ <span aria-hidden="true">→</span></a></div></div>
  </section>;
}

export function VisionScene() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(section.current!.querySelectorAll(".vision-stripe"), {
          scaleY: 1, stagger: 0.1, ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top -35%",
            end: "top -160%",
            scrub: true,
          },
        });
      }, section.current);
      media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const root = section.current;
        if (!root) return;
        const stripes = [...root.querySelectorAll<HTMLElement>(".vision-stripe")];
        const update = (progress: number) => {
          const compact = window.innerWidth < 480;
          const travel = progress * 1.8;
          stripes.forEach((stripe, index) => {
            const scale = compact && progress <= 0
              ? 0
              : Math.min(1, Math.max(0, travel + 0.45 - (4 - index) * 0.25));
            stripe.style.transform = `scaleY(${scale})`;
          });
        };
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: () => window.innerWidth < 480 ? "top -30%" : "top -38%",
          end: () => window.innerWidth < 480 ? "top -145%" : "top -194%",
          onUpdate: ({ progress }) => update(progress),
          onRefresh: ({ progress }) => update(progress),
        });
        update(trigger.progress);
        return () => trigger.kill();
      }, section.current);
      cleanup = () => media.revert();
    })();
    return () => { cancelled = true; cleanup?.(); };
  }, []);
  return <section aria-label="Мой подход" className="vision-section" id="vision" ref={section}><div className="vision-sticky">
    <p className="vision-copy">ЯСНАЯ ЗАДАЧА.<br />ТОЧНАЯ РЕАЛИЗАЦИЯ.</p>
    <div aria-hidden="true" className="vision-marquee"><div className="vision-marquee-track">{Array.from({ length: 3 }, (_, index) => <span key={index}>ПРОЕКТИРУЮ <i>+</i> СОЗДАЮ <i>+</i> АВТОМАТИЗИРУЮ <i>+</i></span>)}</div></div>
    <p className="vision-caption">✦ ОТ ИДЕИ ДО РАБОЧЕГО ИНТЕРФЕЙСА.</p>
    <div aria-hidden="true" className="vision-stripes">{Array.from({ length: 5 }, (_, index) => <div className="vision-stripe" key={index} />)}</div>
  </div></section>;
}
