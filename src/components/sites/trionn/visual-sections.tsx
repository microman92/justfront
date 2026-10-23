"use client";

import Image from "next/image";
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
      const description = card.querySelector<HTMLElement>(".project-caption p");
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
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        // 200vh moves the project rail; 150vh slides Services in from the right.
        end: () => `+=${window.innerHeight * 3.5}`,
        pin: true,
        pinSpacing: false,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: revealVisibleCards,
        onRefresh: revealVisibleCards,
      },
    });
    timeline.set(servicePanel, { position: "fixed", top: 0, left: 0, width: "100%", zIndex: 5, xPercent: 100 }, 0);
    timeline.to(track, { x: railEnd, ease: "none", duration: 2 });
    timeline.to(track, { x: () => railEnd() - window.innerWidth, ease: "none", duration: 1.5 });
    // Finish covering the viewport before the rail releases its pin.
    timeline.to(servicePanel, { xPercent: 0, ease: "none", duration: 1.4 }, "<");
    timeline.set(servicePanel, { position: "sticky", zIndex: "auto" });
    timeline.set(section, { visibility: "hidden" });
    ScrollTrigger.refresh();
  };
  const scope = useScrollTrigger(setup);

  return (
    <section aria-labelledby="work-title" className="work-section" id="work" ref={scope}>
      <div className="project-track">
      <div className="work-heading">
        <h2 id="work-title">Selected work &amp; explorations</h2>
        <a className="underlined-link" href="https://trionn.com/work">VIEW ALL PROJECTS <span aria-hidden="true">→</span></a>
      </div>
        {items.map((project, index) => (
          <article className={`project-card project-card-${index + 1}`} key={project.name}>
            <a aria-label={`Explore ${project.name} project`} className="project-image" href={project.href}>
              <picture>
                <source media="(max-width: 767px)" srcSet={project.mobileImage} />
                <Image alt={`${project.name} website preview`} height={project.height} priority={index === 0} sizes="(max-width: 767px) 88vw, 60vw" src={project.image} width={project.width} />
              </picture>
              <span className="project-image-arrow" aria-hidden="true">↗</span>
            </a>
            <div className="project-caption">
              <div><h3>{project.name}</h3><p>{project.description}</p></div>
              <a className="underlined-link" href={project.href}>EXPLORE PROJECT <span aria-hidden="true">→</span></a>
            </div>
          </article>
        ))}
      <div className="work-closer"><p>Discover our complete collection of digital experiences, brands, and platforms.</p><a className="underlined-link" href="https://trionn.com/work">VIEW ALL PROJECTS <span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  );
}

export function ServiceScene() {
  const scope = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mobileVideo = useRef<HTMLVideoElement>(null);
  const descriptions = [
    "AI-powered solutions designed to enhance products, automate workflows, and unlock smarter digital experiences.",
    "Custom web development delivered with a product-focused, design-conscious approach.",
    "Thoughtful product design that captures attention, deepens engagement, and builds lasting loyalty.",
    "High-quality website and app experiences designed to attract users and keep them coming back.",
    "WordPress development focused on performance, clarity, and experiences that convert visitors into loyal users.",
    "Impactful branding positions startups for success through credibility, clarity, and lasting loyalty.",
  ];
  const desktopCardOrder = [0, 3, 1, 4, 2, 5];

  useEffect(() => {
    if (!scope.current) return;
    const elements = [video.current, mobileVideo.current];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    let visible = false;
    const updateVideos = () => {
      elements.forEach((element, index) => {
        if (!element) return;
        const selected = mobile.matches ? index === 1 : index === 0;
        if (reducedMotion.matches || !visible || !selected || document.hidden) element.pause();
        else void element.play().catch(() => undefined);
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateVideos();
    });
    observer.observe(scope.current);
    reducedMotion.addEventListener("change", updateVideos);
    mobile.addEventListener("change", updateVideos);
    document.addEventListener("visibilitychange", updateVideos);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", updateVideos);
      mobile.removeEventListener("change", updateVideos);
      document.removeEventListener("visibilitychange", updateVideos);
      elements.forEach((element) => element?.pause());
    };
  }, []);

  return (
    <section aria-labelledby="services-title" className="services-section" id="services" ref={scope}>
      <div className="service-sticky">
        <div aria-hidden="true" className="service-backdrop">
          <video className="service-desktop-backdrop" muted playsInline loop preload="none" ref={video} src="/sites/trionn/video/services.mp4" />
          <video className="service-mobile-backdrop" muted playsInline loop preload="none" ref={mobileVideo} src="/sites/trionn/video/services-mobile.mp4" />
        </div>
        <h2 className="service-heading" id="services-title">OUR SERVICES</h2>
        <div aria-hidden="true" className="service-intro-words">
          {["A.I.", "DESIGN", "DEVELOPMENT", "BRANDING"].map((word) => <div className="service-intro-word" key={word}>{[...word].map((letter, index) => <span className="service-intro-letter" key={`${word}-${index}`}>{letter}</span>)}</div>)}
        </div>
        <ServiceSequence />
        <ol className="service-list service-desktop-list">
          {desktopCardOrder.map((originalIndex, index) => <li className={`service-row service-row-${index + 1}${index === 0 ? " is-active" : ""}`} key={services[originalIndex]}>
            <h3>{services[originalIndex]}</h3>
            <Image alt="" aria-hidden="true" className="service-card-symbol" height={100} src={`/sites/trionn/services/service-${String(originalIndex + 1).padStart(2, "0")}.svg`} width={100} />
            <p>{descriptions[originalIndex]}</p>
          </li>)}
        </ol>
        <ol className="service-list service-mobile-list">
          {["A.I.", "Design", "Development", "Branding"].map((service, index) => <li className={`service-row service-row-${index + 1}${index === 0 ? " is-active" : ""}`} key={service}>{service}</li>)}
        </ol>
        <p className="service-caption service-caption-intent"><span aria-hidden="true">✦</span> DESIGN WITH INTENT. BUILT TO WORK.</p>
        <p className="service-caption"><span aria-hidden="true">✦</span> DIFFERENT DISCIPLINES. ONE STANDARD OF CRAFT.</p>
        <a className="underlined-link service-cta" href="https://trionn.com/services">VIEW SERVICES <span aria-hidden="true">→</span></a>
        <div aria-hidden="true" className="service-exit-stripes">
          {Array.from({ length: 5 }, (_, index) => <div className="service-exit-stripe" key={index} />)}
        </div>
      </div>
    </section>
  );
}

