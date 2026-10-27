"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "./content";
import { reviewSlots, type ReviewSlot } from "./review-slots";
import { ReviewCard } from "./review-card";
import { ReviewDialog } from "./review-dialog";
import reviewStyles from "./reviews.module.css";
import { ServiceSequence } from "./service-sequence";

const siteReviews = reviewSlots.filter((review) => review.side === "site");
const teachingReviews = reviewSlots.filter((review) => review.side === "teaching");
const orderedReviews = Array.from({ length: Math.max(siteReviews.length, teachingReviews.length) }, (_, index) => [siteReviews[index], teachingReviews[index]])
  .flat().filter((review): review is ReviewSlot => Boolean(review));

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
      const story = card.querySelector<HTMLElement>(".project-story");
      const link = card.querySelector<HTMLElement>(".project-caption a");
      gsap.set([title, story, link], { autoAlpha: 0 });
      return gsap.timeline({ paused: true })
        .to(title, { autoAlpha: 1, duration: 0.7, ease: "sine.out" })
        .to(story, { autoAlpha: 1, duration: 0.6, ease: "sine.out" }, "<")
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
        <a className="underlined-link" href="#reviews">СМОТРЕТЬ УСЛУГИ <span aria-hidden="true">↓</span></a>
      </div>
        {items.map((project, index) => (
          <article className={`project-card project-card-${index + 1}`} key={project.name}>
            <a aria-label={`Открыть сайт ${project.name}`} className="project-image" href={project.href} rel="noopener noreferrer" target="_blank">
              <div aria-hidden="true" className="project-cover">
                <span className="project-cover-index">0{index + 1} / КЕЙС</span>
                <strong className="project-cover-name">{project.name}</strong>
                <span className="project-cover-category">{project.category}</span>
                <span className="project-cover-focus">{project.focus}</span>
              </div>
              <span className="project-image-arrow" aria-hidden="true">↗</span>
            </a>
            <div className="project-caption">
              <h3>{project.name}</h3>
              <div className="project-story">
                <p><span>ЗАДАЧА</span>{project.task}</p>
                <p><span>РЕШЕНИЕ</span>{project.solution}</p>
                <p><span>ИТОГ</span>{project.outcome}</p>
              </div>
              <a className="underlined-link" href={project.href} rel="noopener noreferrer" target="_blank">ОТКРЫТЬ ПРОЕКТ <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        ))}
      <div className="work-closer"><p>От задачи до работающего интерфейса. Посмотрите проекты вживую.</p><a className="underlined-link" href="#contact">ОБСУДИТЬ ВАШ ПРОЕКТ <span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  );
}

export function ReviewsScene() {
  const scope = useRef<HTMLElement>(null);
  const [selectedReview, setSelectedReview] = useState<ReviewSlot | null>(null);

  return (
    <section aria-labelledby="reviews-title" className={`services-section ${reviewStyles.scene}`} id="reviews" ref={scope}>
      <div className="service-sticky">
        <div aria-hidden="true" className="service-backdrop">
          <span className="service-smoke service-smoke-one" />
          <span className="service-smoke service-smoke-two" />
          <span className="service-smoke service-smoke-three" />
        </div>
        <h2 className="service-heading" id="reviews-title">ОТЗЫВЫ</h2>
        <div aria-hidden="true" className="service-intro-words">
          {["РАБОТА", "И", "ОБУЧЕНИЕ"].map((word) => <div className="service-intro-word" key={word}>{[...word].map((letter, index) => <span className="service-intro-letter" key={word + index}>{letter}</span>)}</div>)}
        </div>
        <ServiceSequence />
        <ol className="service-list service-desktop-list" aria-label="Отзывы о работе и преподавании">
          {orderedReviews.map((review, index) => <li className={`service-row service-row-${index + 1}${index === 0 ? " is-active" : ""}`} data-review-side={review.side} key={review.id}>
            <ReviewCard review={review} index={index} onOpen={setSelectedReview} />
          </li>)}
        </ol>
        <ol className="service-list service-mobile-list" aria-label="Отзывы о работе и преподавании">
          {orderedReviews.map((review, index) => <li className={`service-row service-row-${index + 1}${index === 0 ? " is-active" : ""}`} data-review-side={review.side} key={review.id}>
            <ReviewCard review={review} index={index} onOpen={setSelectedReview} />
          </li>)}
        </ol>
        <p className="service-caption service-caption-intent"><span aria-hidden="true">✦</span> О РАБОТЕ И ОБУЧЕНИИ СО МНОЙ.</p>
        <p className="service-caption"><span aria-hidden="true">✦</span> ОТЗЫВЫ КЛИЕНТОВ И УЧЕНИКОВ.</p>
        <a className="underlined-link service-cta" href="#contact">ОБСУДИТЬ ПРОЕКТ <span aria-hidden="true">→</span></a>
        <div aria-hidden="true" className="service-exit-stripes">
          {Array.from({ length: 5 }, (_, index) => <div className="service-exit-stripe" key={index} />)}
        </div>
      </div>
      {selectedReview && <ReviewDialog review={selectedReview} onClose={() => setSelectedReview(null)} />}
    </section>
  );
}

