"use client";

import { useEffect, useRef } from "react";
import type { Project } from "./content";
import { services } from "./content";
import { ServiceSequence } from "./service-sequence";

function useScrollTrigger(setup: (gsap: typeof import("gsap").gsap, trigger: typeof import("gsap/ScrollTrigger").ScrollTrigger) => void) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let revert: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !scope.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => setup(gsap, ScrollTrigger), scope.current);
      revert = () => media.revert();
    })();
    return () => {
      disposed = true;
      revert?.();
    };
  }, [setup]);

  return scope;
}

export function ProjectRail({ projects: items }: { projects: Project[] }) {
  const setup = (gsap: typeof import("gsap").gsap, ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger) => {
    const track = document.querySelector<HTMLElement>(".project-track");
    const section = document.querySelector<HTMLElement>(".work-section");
    if (!track || !section) return;
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".project-card"));
    const reveals = cards.map((card) => {
      const title = card.querySelector<HTMLElement>(".project-caption h3");
      const description = card.querySelector<HTMLElement>(".project-description");
      const link = card.querySelector<HTMLElement>(".project-caption a");
      gsap.set([title, description, link], { autoAlpha: 0 });
      return gsap.timeline({ paused: true })
        .to(title, { autoAlpha: 1, duration: 0.7, ease: "sine.out" })
        .to(description, { autoAlpha: 1, duration: 0.6, ease: "sine.out" }, "<")
        .to(link, { autoAlpha: 1, duration: 0.4, ease: "sine.out" }, "<50%");
    });
    const revealVisibleCards = () => cards.forEach((card, index) => {
      const bounds = card.getBoundingClientRect();
      if (bounds.left < window.innerWidth * 0.8 && bounds.right > 0) reveals[index].play();
    });
    const servicePanel = document.querySelector<HTMLElement>(".service-sticky");
    if (!servicePanel) return;
    const railEnd = () => Math.min(0, window.innerWidth - track.scrollWidth - 40);
    const railScreens = () => Math.max(1, (track.scrollWidth + 40 - window.innerWidth) / window.innerWidth);
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * (railScreens() + 1.2)}`,
        pin: true,
        pinSpacing: false,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: revealVisibleCards,
        onRefresh: revealVisibleCards,
      },
    });
    timeline.set(servicePanel, { position: "fixed", top: 0, left: 0, width: "100%", zIndex: 5, xPercent: 100 }, 0);
    timeline.to(track, { x: railEnd, ease: "none", duration: railScreens() });
    timeline.to(servicePanel, { xPercent: 0, ease: "none", duration: 1.2 });
    timeline.set(servicePanel, { position: "sticky", zIndex: "auto" });
    timeline.set(section, { visibility: "hidden" });
    ScrollTrigger.refresh();
  };
  const scope = useScrollTrigger(setup);

  return (
    <section aria-labelledby="work-title" className="work-section" id="work" ref={scope}>
      <div className="project-track">
      <div className="work-heading">
        <h2 id="work-title">Реальные проекты</h2>
        <a className="underlined-link" href="#service-scene">СМОТРЕТЬ УСЛУГИ <span aria-hidden="true">↓</span></a>
      </div>
        {items.map((project, index) => (
          <article className={`project-card project-card-${index + 1}`} key={project.name}>
            <a aria-label={`Открыть сайт ${project.name}`} className="project-image" href={project.href} rel="noopener noreferrer" target="_blank">
              <div aria-hidden="true" className="project-cover">
                <span className="project-cover-index">0{index + 1} / JUSTFRONT</span>
                <strong className="project-cover-name">{project.name}</strong>
                <span className="project-cover-category">{project.category}</span>
                <span className="project-cover-focus">{project.focus}</span>
              </div>
              <span className="project-image-arrow" aria-hidden="true">↗</span>
            </a>
            <div className="project-caption">
              <div><p className="project-meta">{project.category}</p><h3>{project.name}</h3><p className="project-description">{project.description}</p></div>
              <a className="underlined-link" href={project.href} rel="noopener noreferrer" target="_blank">ОТКРЫТЬ САЙТ <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        ))}
      <div className="work-closer"><p>Ссылки ведут на опубликованные проекты. В каждом описании указал свою часть работы и технологии.</p><a className="underlined-link" href="#contact">ОБСУДИТЬ ВАШ ПРОЕКТ <span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  );
}

export function ServiceScene() {
  const scope = useRef<HTMLElement>(null);
  const descriptions = [
    "Корпоративные и сервисные сайты с адаптивной вёрсткой, SEO и нужными интеграциями.",
    "Веб-интерфейсы, кабинеты и внутренние инструменты на React, Next.js, Vue и Nuxt.",
    "Подключаю AI-инструменты и автоматизирую повторяющиеся процессы бизнеса.",
  ];
  const desktopCardOrder = [0, 1, 2];

  return (
    <section aria-labelledby="services-title" className="services-section" id="service-scene" ref={scope}>
      <div className="service-sticky">
        <div aria-hidden="true" className="service-backdrop">
          <span className="service-smoke service-smoke-one" />
          <span className="service-smoke service-smoke-two" />
          <span className="service-smoke service-smoke-three" />
        </div>
        <h2 className="service-heading" id="services-title">УСЛУГИ</h2>
        <div aria-hidden="true" className="service-intro-words">
          {["САЙТЫ", "ВЕБ", "AI"].map((word) => <div className="service-intro-word" key={word}>{[...word].map((letter, index) => <span className="service-intro-letter" key={word + index}>{letter}</span>)}</div>)}
        </div>
        <ServiceSequence />
        <ol className="service-list service-desktop-list">
          {desktopCardOrder.map((originalIndex, index) => <li className={`service-row service-row-${index + 1}${index === 0 ? " is-active" : ""}`} key={services[originalIndex]}>
            <h3>{services[originalIndex]}</h3>
            <span aria-hidden="true" className="service-card-symbol">0{originalIndex + 1}</span>
            <p>{descriptions[originalIndex]}</p>
          </li>)}
        </ol>
        <ol className="service-list service-mobile-list">
          {services.map((service, index) => <li className={`service-row service-row-${index + 1}${index === 0 ? " is-active" : ""}`} key={service}>{service}</li>)}
        </ol>
        <p className="service-caption service-caption-intent"><span aria-hidden="true">✦</span> ЯСНЫЕ ЗАДАЧИ. ВНИМАНИЕ К ДЕТАЛЯМ.</p>
        <p className="service-caption"><span aria-hidden="true">✦</span> САЙТЫ / ВЕБ-ПРИЛОЖЕНИЯ / AI-АВТОМАТИЗАЦИЯ.</p>
        <a className="underlined-link service-cta" href="#contact">ОБСУДИТЬ ПРОЕКТ <span aria-hidden="true">→</span></a>
        <div aria-hidden="true" className="service-exit-stripes">
          {Array.from({ length: 5 }, (_, index) => <div className="service-exit-stripe" key={index} />)}
        </div>
      </div>
    </section>
  );
}

