"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Cpu, Database, Globe, Send, Layers, GraduationCap } from "lucide-react";
import { ContactTrigger } from "./interaction-shell";
import styles from "./key-facts.module.css";

const directions = [
  {
    title: "Сайты и веб-приложения",
    formats: "Лендинги · корпоративные сайты · личные кабинеты",
    outcome: "От первого клика к обращению",
    detail: "Помогаю клиенту разобраться в предложении и сделать следующий шаг: оставить заявку, записаться или воспользоваться сервисом.",
    steps: ["Посетитель", "Интерфейс", "Заявка"],
    icon: Globe,
  },
  {
    title: "CRM и бизнес-системы",
    formats: "Клиенты · заявки · процессы · интеграции",
    outcome: "Вся работа в одной системе",
    detail: "Собираю данные, заявки и действия команды в понятный рабочий процесс. Связываю сайт и сервисы с CRM.",
    steps: ["Заявки", "CRM", "Команда"],
    icon: Database,
  },
  {
    title: "Telegram-продукты",
    formats: "Telegram-боты · Mini Apps · сервисы в мессенджере",
    outcome: "Ваш сервис уже в Telegram",
    detail: "Создаю ботов и Mini Apps для заявок, записи и работы с клиентами. Подключаю нужные данные и бизнес-логику.",
    steps: ["Клиент", "Бот / Mini App", "CRM / сервис"],
    icon: Send,
  },
  {
    title: "AI и автоматизация",
    formats: "AI-ассистенты · обработка данных · API",
    outcome: "Меньше повторяющихся действий",
    detail: "Встраиваю AI в конкретные процессы: обработку запросов, подготовку материалов и работу с данными. Определяем, где нужен контроль человека.",
    steps: ["Данные", "AI-сценарий", "Действие"],
    icon: Cpu,
  },
] as const;

const offers = [...directions, {
  title: "Решения под ключ",
  formats: "Структура · интерфейс · интеграции · запуск",
  outcome: "От задачи до работающего продукта",
  detail: "Соберу сайт, сервис и нужные интеграции в одно решение. До старта согласуем объём работ, этапы и критерии готовности.",
  steps: ["Задача", "Разработка", "Запуск"],
  icon: Layers,
}, {
  title: "Преподавание",
  formats: "PROWEB · с 2021 года · 300+ учеников",
  outcome: "Объясняю технологии через практику",
  detail: "Преподаю Frontend и AI-направления в PROWEB. Помогаю разобраться в инструментах и применять их к реальным задачам.",
  steps: ["Frontend", "Практика", "AI"],
  icon: GraduationCap,
}];

export function KeyFacts() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed || !section.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add({
        desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 767px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
      }, () => {
        const root = section.current!;
        const rail = track.current!;
        const travel = () => Math.max(0, rail.scrollWidth - window.innerWidth);
        const tween = gsap.to(rail, {
          x: () => -travel(), ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .8, invalidateOnRefresh: true },
        });
        root.querySelectorAll<HTMLElement>("[data-offer-copy]").forEach((copy) => {
          gsap.fromTo(copy, { opacity: .2, y: 20 }, {
            opacity: 1, y: 0, duration: .6, ease: "power2.out",
            scrollTrigger: { trigger: copy, containerAnimation: tween, start: "left 85%", toggleActions: "play none none reverse" },
          });
        });
        const handleFocus = (event: FocusEvent) => {
          const card = (event.target as HTMLElement).closest<HTMLElement>("[data-offer-card]");
          if (!card) return;
          const trigger = tween.scrollTrigger;
          if (!trigger || !travel()) return;
          const destination = Math.min(travel(), Math.max(0, card.offsetLeft - window.innerWidth * .12));
          window.scrollTo({ top: trigger.start + destination / travel() * (trigger.end - trigger.start), behavior: "instant" });
        };
        root.addEventListener("focusin", handleFocus);
        return () => root.removeEventListener("focusin", handleFocus);
      }, section.current);
      cleanup = () => media.revert();
    })();
    return () => { disposed = true; cleanup?.(); };
  }, []);

  return <section className={styles.section} id="services" aria-labelledby="facts-title" ref={section}>
    <div className={styles.anchor} id="keyfacts" />
    <div className={styles.sticky}>
      <div className={styles.track} ref={track}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>01 / ЧЕМ МОГУ ПОМОЧЬ</p>
          <h2 id="facts-title">От сайта<br />до целой<br />{" "}<span>системы.</span></h2>
          <p className={styles.introduction}>Разработка, интеграции и обучение.<br />Инструменты под вашу задачу.</p>
          <p className={styles.scrollHint}>ЛИСТАЙТЕ ДАЛЬШЕ <span aria-hidden="true">→</span></p>
        </header>
        {offers.map((offer, index) => {
          const Icon = offer.icon;
          return <article className={styles.card} key={offer.title} data-offer-card>
            <div className={styles.cover}>
              <p className={styles.eyebrow}>0{index + 1} / {index === 5 ? "ОПЫТ" : "НАПРАВЛЕНИЕ"}</p>
              <h3>{offer.title}</h3>
              <div className={styles.flow} aria-hidden="true">{offer.steps.map((step, stepIndex) => <div className={styles.step} key={step}>
                <span className={styles.node}>{stepIndex === 1 ? <Icon size={25} strokeWidth={1.2} /> : `0${stepIndex + 1}`}</span><span>{step}</span>
              </div>)}</div>
              <p className={styles.formats}>{offer.formats}</p>
            </div>
            <div className={styles.caption} data-offer-copy>
              <div className={styles.captionHead}><h4>{offer.outcome}</h4><ContactTrigger className={styles.contact}>ОБСУДИТЬ ЗАДАЧУ <ArrowUpRight size={15} aria-hidden="true" /></ContactTrigger></div>
              <div className={styles.details}><p><span>{index === 5 ? "ОПЫТ" : "ЧТО ДЕЛАЮ"}</span>{offer.detail}</p><p><span>{index === 5 ? "НАПРАВЛЕНИЯ" : "ФОРМАТ"}</span>{offer.formats}</p></div>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
