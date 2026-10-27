"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "./content";
import styles from "./project-details.module.css";

export function ProjectDetails({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!section.current || !stage.current) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled || !section.current || !stage.current) return;
      const context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add({
          desktop: "(min-width: 768px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
        }, (context) => {
          const mobile = Boolean(context.conditions?.mobile);
          const root = section.current!;
          const viewport = stage.current!;
          const cards = Array.from(viewport.querySelectorAll<HTMLElement>("[data-project-card]"));
          root.classList.add(styles.animated);
          const origin = () => `50% 50% -${(mobile ? Math.min(viewport.clientWidth, viewport.clientHeight) : viewport.clientHeight) / 2}px`;
          gsap.set(cards, { rotationX: 0, rotationY: 0, autoAlpha: 0, transformOrigin: origin });
          gsap.set(cards[0], { autoAlpha: 1 });
          let activeIndex = -1;
          const timeline = gsap.timeline({
            paused: true,
            onUpdate: () => {
              const index = Math.min(cards.length - 1, Math.max(0, Math.floor((timeline.time() + 0.45) / 1.5)));
              if (index === activeIndex) return;
              activeIndex = index;
              cards.forEach((card, cardIndex) => {
                card.inert = cardIndex !== index;
                card.setAttribute("aria-hidden", String(cardIndex !== index));
              });
              if (counter.current) counter.current.textContent = String(index + 1).padStart(2, "0");
            },
          });
          cards.forEach((card, index) => {
            if (!index) return;
            const start = index * 1.5 - 0.9;
            const turns = [
              { axis: "rotationY", angle: -90 },
              { axis: "rotationX", angle: 90 },
              { axis: "rotationY", angle: 90 },
              { axis: "rotationX", angle: -90 },
            ] as const;
            const { axis, angle } = mobile ? turns[(index - 1) % turns.length] : { axis: "rotationX", angle: 90 };
            timeline.set(card, { rotationX: 0, rotationY: 0, autoAlpha: 1 }, start);
            timeline.to(cards[index - 1], { [axis]: angle, duration: 0.9, ease: "none" }, start);
            timeline.fromTo(card, { [axis]: -angle }, { [axis]: 0, duration: 0.9, ease: "none", immediateRender: false }, start);
            timeline.set(cards[index - 1], { autoAlpha: 0 }, start + 0.9);
          });
          let frame = 0;
          let initialHold = 0;
          let transitionDistance = 1;
          const update = () => {
            frame = 0;
            // Read the live section position: the ribbon above changes its pin spacing on refresh.
            const distance = Math.max(0, -root.getBoundingClientRect().top - initialHold);
            const time = Math.min(timeline.duration(), distance / transitionDistance * 1.5);
            timeline.time(time, false);
          };
          const requestUpdate = () => {
            if (!frame) frame = requestAnimationFrame(update);
          };
          const measure = () => {
            initialHold = Math.min(100, window.innerHeight * 0.12);
            transitionDistance = window.innerHeight * 0.58;
            const finalHold = Math.min(100, window.innerHeight * 0.12);
            root.style.setProperty("--project-travel", `${initialHold + (cards.length - 1) * transitionDistance + finalHold}px`);
            gsap.set(cards, { transformOrigin: origin, smoothOrigin: false });
            requestUpdate();
          };
          cards.forEach((card, index) => { card.inert = index !== 0; card.setAttribute("aria-hidden", String(index !== 0)); });
          window.addEventListener("scroll", requestUpdate, { passive: true });
          window.addEventListener("resize", measure);
          measure();
          return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", measure);
            root.style.removeProperty("--project-travel");
            root.classList.remove(styles.animated);
            cards.forEach(card => { card.inert = false; card.removeAttribute("aria-hidden"); });
            if (counter.current) counter.current.textContent = "01";
          };
        });
        return () => media.revert();
      }, section.current);
      cleanup = () => context.revert();
    })();
    return () => { cancelled = true; cleanup?.(); };
  }, [projects]);

  return <section ref={section} className={styles.section} id="project-details" aria-label="Подробное описание проектов">
    <div className={styles.sticky}>
    <div className={styles.heading}>
      <div><p>ИЗБРАННЫЕ РАБОТЫ / 01—06</p><h2>За каждым сайтом —<br />своя задача.</h2></div>
      <span>Прокрутите, чтобы посмотреть проекты, решения и результат.</span>
    </div>
    <div className={styles.stage} ref={stage}>
      {projects.map((project, index) => <article className={styles.project} data-project-card key={project.name}>
        <a className={styles.preview} href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Открыть сайт ${project.name}`}>
          <Image src={project.preview} alt={`Скриншот сайта ${project.name}`} width={1280} height={720} sizes="(max-width: 767px) 100vw, 50vw" />
          <span className={styles.previewIndex}>ПОСМОТРЕТЬ САЙТ <span aria-hidden="true">↗</span></span>
        </a>
        <div className={styles.description}>
          <div className={styles.projectHead}>
            <div><p>{project.category}</p><h3>{project.name}</h3></div>
            <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <dl className={styles.story}>
            <div><dt>ЗАДАЧА</dt><dd>{project.task}</dd></div>
            <div><dt>РЕШЕНИЕ</dt><dd>{project.solution}</dd></div>
            <div><dt>ИТОГ</dt><dd>{project.outcome}</dd></div>
          </dl>
          <a className={styles.link} href={project.href} target="_blank" rel="noopener noreferrer">ОТКРЫТЬ ПРОЕКТ <span aria-hidden="true">↗</span></a>
        </div>
      </article>)}
    </div>
    <div className={styles.footer} aria-hidden="true"><span>ПРОКРУТКА ПОВОРАЧИВАЕТ СЛЕДУЮЩУЮ ГРАНЬ</span><span><span ref={counter}>01</span> / {String(projects.length).padStart(2, "0")} <span className={styles.down}>↓</span></span></div>
    </div>
  </section>;
}
