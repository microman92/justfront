"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { services } from "./content";

function RollingValue({ value, label, suffix = "+" }: { value: number; label: string; suffix?: string }) {
  const element = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !element.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.registerPlugin(ScrollTrigger);
      const state = { value: 0 };
      const context = gsap.context(() => {
        gsap.to(state, {
          value,
          duration: 1.7,
          ease: "power3.out",
          scrollTrigger: { trigger: element.current, start: "top 90%", toggleActions: "restart none none reset" },
          onUpdate: () => {
            if (element.current) element.current.textContent = String(Math.round(state.value));
          },
        });
      });
      cleanup = () => context.revert();
    })();
    return () => { cancelled = true; cleanup?.(); };
  }, [value]);
  return <strong aria-label={label}><span aria-hidden="true" ref={element}>{value}</span><small aria-hidden="true">{suffix}</small></strong>;
}

export function KeyFacts() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const root = section.current;
        const grid = root?.querySelector<HTMLElement>(".facts-grid");
        if (!root || !grid) return;
        const move = (progress: number) => { grid.scrollLeft = Math.min(1, progress * 1.7) * (grid.scrollWidth - grid.clientWidth); };
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => "+=" + window.innerHeight,
          pin: true,
          anticipatePin: 1,
          onUpdate: ({ progress }) => move(progress),
          onRefresh: ({ progress }) => move(progress),
        });
        return () => trigger.kill();
      });
      cleanup = () => media.revert();
    })();
    return () => { cancelled = true; cleanup?.(); };
  }, []);

  return <section aria-labelledby="facts-title" className="facts-section" id="services" ref={section}>
    <div className="facts-intro" id="keyfacts"><h2 id="facts-title">Веб-разработка<br />и AI для бизнеса</h2><p>От интерфейса<br />до автоматизации.</p></div>
    <div aria-label="Услуги, преподавание и формат работы" className="facts-grid" tabIndex={0}>
      <div className="fact-block fact-studio">
        <span className="fact-label">JUSTFRONT / 01</span>
        <div className="fact-orbit-mark"><Image alt="" height={763} src="/sites/mk-studio/brand/justfront-mark.svg" width={788} /></div>
        <div className="fact-bottom"><p>Михаил Кудрицкий<br />Frontend-разработчик</p><span className="fact-status">ТАШКЕНТ · ОНЛАЙН</span></div>
      </div>
      <div className="fact-block fact-projects">
        <span className="fact-label">УСЛУГИ / 03</span>
        <ul className="fact-services-list">
          {services.map((service, index) => <li key={service}><span>0{index + 1}</span>{service}</li>)}
        </ul>
        <p className="fact-stack">React · Next.js · Vue · Nuxt</p>
      </div>
      <div className="fact-block fact-team">
        <span className="fact-label">PROWEB / 02</span>
        <div className="fact-teaching-count"><RollingValue label="Более 300 учеников изучали Frontend на занятиях в PROWEB" value={300} /></div>
        <div className="fact-bottom"><p>Преподавал Frontend.<br />Сейчас веду AI-направления.</p><span className="fact-status">ПРЕПОДАВАТЕЛЬ С 2021</span></div>
      </div>
    </div>
    <div className="partner-row"><p>ТЕХНОЛОГИИ И ФОРМАТ</p><div><span>REACT · NEXT.JS · TYPESCRIPT</span><span>VUE · NUXT · GSAP</span><span>ТАШКЕНТ · УДАЛЁННО</span></div></div>
  </section>;
}
