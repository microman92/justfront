"use client";

import { useEffect, useState } from "react";
import { ContactTrigger } from "./interaction-shell";
import { HeroProof } from "./hero-proof";
import { TeachingDirections } from "./teaching-directions";

const rotatingServices = [
  "сайты",
  "веб-приложения",
  "Telegram-ботов",
  "Mini Apps",
  "CRM-системы",
  "AI-решения",
  "автоматизацию",
  "решения под ключ",
] as const;

export function HeroExperience() {
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveService((current) => (current + 1) % rotatingServices.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-labelledby="hero-title"
      className="hero-section"
      id="top"
    >
      <div className="hero-copy">
        <p className="hero-pretitle">JUSTFRONT · МИХАИЛ КУДРИЦКИЙ</p>
        <h1 aria-label="Разрабатываю сайты, веб-приложения, Telegram-боты и Mini Apps, CRM-системы, AI-решения, системы автоматизации и решения под ключ. Преподаю Frontend и AI в PROWEB." id="hero-title">
          Разрабатываю<br /><span aria-hidden="true" className="rotating-word" key={activeService}>{rotatingServices[activeService]}</span>
        </h1>
        <div aria-label="Преподаю Frontend, AI-разработку и Старт в IT в PROWEB с 2021 года" className="hero-teaching">
          <span className="hero-teaching-label">ПРЕПОДАВАНИЕ · PROWEB · С 2021</span>
          <TeachingDirections />
        </div>
        <div className="hero-links">
          <ContactTrigger className="text-link">ОБСУДИТЬ ПРОЕКТ <span aria-hidden="true">→</span></ContactTrigger>
          <a className="text-link" href="#work">МОИ ПРОЕКТЫ <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className="hero-bottom">
        <HeroProof />
        <p className="hero-summary">Frontend-разработчик из Ташкента. React, Next.js, Vue и Nuxt.</p>
      </div>
      <p aria-hidden="true" className="hero-instruction">ЗАЖМИТЕ, ЧТОБЫ РАЗЛЕТЕЛСЯ ЛОГОТИП</p>
      <a aria-label="Перейти к вариантам решения задач бизнеса" className="hero-scroll" href="#keyfacts">↓</a>
    </section>
  );
}
