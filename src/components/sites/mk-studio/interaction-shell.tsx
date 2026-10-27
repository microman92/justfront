"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SplitHoverText } from "./split-hover-text";

type InteractionState = {
  openContact: () => void;
  openMenu: () => void;
};

const InteractionContext = createContext<InteractionState | null>(null);

function useInteractions() {
  const value = useContext(InteractionContext);
  if (!value) throw new Error("Site controls must be used inside SiteInteractionShell");
  return value;
}

export function ContactTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { openContact } = useInteractions();
  return (
    <button className={className} onClick={openContact} type="button">
      {children}
    </button>
  );
}

export function SiteInteractionShell({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const openContact = useCallback(() => {
    setMenuOpen(false);
    setContactOpen(true);
  }, []);
  const openMenu = useCallback(() => setMenuOpen((current) => !current), []);

  useEffect(() => {
    let disposed = false;
    let revert = () => {};

    const setup = async () => {
      const { default: gsap } = await import("gsap");
      await document.fonts.ready;
      const header = headerRef.current;
      if (!header || disposed) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          const brand = header.querySelector(".brand-link");
          const actions = header.querySelector(".header-actions");
          if (!brand || !actions) return;

          gsap.from([brand, actions], {
            autoAlpha: 0,
            y: -16,
            duration: 0.78,
            ease: "power3.out",
            stagger: 0.12,
            clearProps: "transform,opacity,visibility",
          });
        }, header);

        return () => context.revert();
      });
      revert = () => media.revert();
      if (disposed) revert();
    };

    void setup();
    return () => {
      disposed = true;
      revert();
    };
  }, []);

  useEffect(() => {
    if (!contactOpen && !menuOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = document.querySelector<HTMLElement>(contactOpen ? ".contact-panel" : ".menu-panel");
    const focusable = () => [...(panel?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea') ?? [])];
    focusable()[0]?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContactOpen(false);
        setMenuOpen(false);
      }
      if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("overlay-open");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("overlay-open");
      previousFocus?.focus();
    };
  }, [contactOpen, menuOpen]);

  const closeAll = () => {
    setContactOpen(false);
    setMenuOpen(false);
  };

  return (
    <InteractionContext.Provider value={{ openContact, openMenu }}>
      <a className="skip-link" href="#main-content">К основному содержимому</a>
      <header className="site-header" ref={headerRef}>
        <a aria-label="На главную JustFront" className="brand-link" href="#top">
          <Image alt="" height={763} src="/sites/mk-studio/brand/justfront-mark.svg" width={788} /><span className="brand-name"><SplitHoverText>JustFront</SplitHoverText></span>
        </a>
        <div className="header-actions">
          <button className="talk-pill" onClick={openContact} type="button"><SplitHoverText>ОБСУДИТЬ ПРОЕКТ</SplitHoverText></button>
          <button
            aria-expanded={menuOpen}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            className="menu-pill"
            onClick={openMenu}
            type="button"
          >
            <SplitHoverText key={menuOpen ? "close" : "menu"}>{menuOpen ? "ЗАКРЫТЬ" : "МЕНЮ"}</SplitHoverText><span aria-hidden="true">{menuOpen ? " ×" : " ㆔"}</span>
          </button>
        </div>
      </header>

      {children}

      {menuOpen && (
        <div className="menu-layer" onMouseDown={(event) => event.target === event.currentTarget && closeAll()}>
          <nav aria-label="Основная навигация" className="menu-panel">
            <button aria-label="Закрыть меню" className="contact-close menu-close" onClick={closeAll} type="button">×</button>
            <p className="eyebrow">JUSTFRONT · FRONTEND И AI</p>
            <a href="#services" onClick={closeAll}><SplitHoverText>Услуги</SplitHoverText><span className="menu-index">01</span></a>
            <a href="#work" onClick={closeAll}><SplitHoverText>Проекты</SplitHoverText><span className="menu-index">02</span></a>
            <a href="#about" onClick={closeAll}><SplitHoverText>Обо мне</SplitHoverText><span className="menu-index">03</span></a>
            <a href="#reviews" onClick={closeAll}><SplitHoverText>Отзывы</SplitHoverText><span className="menu-index">04</span></a>
            <button onClick={openContact} type="button"><SplitHoverText>Связаться</SplitHoverText><span className="menu-index">05</span></button>
            <div className="menu-footer">
              <p>Разработка сайтов.<br />Веб-приложения.<br />AI-интеграции.</p>
              <a href="https://t.me/justfront" rel="noopener noreferrer" target="_blank"><SplitHoverText>TELEGRAM<br />@justfront</SplitHoverText></a>
            </div>
          </nav>
        </div>
      )}

      {contactOpen && (
        <div className="contact-layer" onMouseDown={(event) => event.target === event.currentTarget && closeAll()}>
          <section aria-labelledby="contact-title" aria-modal="true" className="contact-panel" role="dialog">
            <button aria-label="Закрыть контакты" className="contact-close" onClick={closeAll} type="button">×</button>
            <p className="eyebrow">JUSTFRONT · СВЯЗЬ</p>
            <h2 id="contact-title">Обсудим задачу.</h2>
            <p className="contact-intro">Сайты, веб-приложения и AI-интеграции. Напишите удобным способом.</p>
            <div className="contact-links">
              <a href="https://t.me/justfront" rel="noopener noreferrer" target="_blank"><span>TELEGRAM</span><strong>@justfront</strong><span aria-hidden="true">↗</span></a>
              <a href="mailto:goody-man@bk.ru"><span>ПОЧТА</span><strong>goody-man@bk.ru</strong><span aria-hidden="true">↗</span></a>
            </div>
          </section>
        </div>
      )}
    </InteractionContext.Provider>
  );
}
