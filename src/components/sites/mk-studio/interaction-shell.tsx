"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SplitHoverText } from "./split-hover-text";
import { ContactForm } from "./contact-form";
import { scrollToSection, setBackgroundScrollLocked } from "./smooth-scroll";

type InteractionState = {
  openContact: () => void;
  openMenu: () => void;
};

const InteractionContext = createContext<InteractionState | null>(null);

const navigationItems = [
  { id: "services", target: "services", label: "Услуги", number: "01" },
  { id: "work", target: "project-details", label: "Проекты", number: "02" },
  { id: "about", target: "about", label: "Обо мне", number: "03" },
  { id: "reviews", target: "reviews", label: "Отзывы", number: "04" },
] as const;

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
  const menuRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactPresent, setContactPresent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayOpen = contactOpen || menuOpen;
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const openContact = useCallback(() => {
    setMenuOpen(false);
    setContactPresent(true);
    setContactOpen(true);
  }, []);

  useEffect(() => {
    const layer = contactRef.current;
    if (!contactPresent || !layer) return;

    if (contactOpen) {
      let secondFrame = 0;
      const firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          layer.classList.add("is-open");
          layer.querySelector<HTMLElement>(".contact-close")?.focus({ preventScroll: true });
        });
      });
      return () => {
        cancelAnimationFrame(firstFrame);
        cancelAnimationFrame(secondFrame);
      };
    }

    layer.classList.remove("is-open");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setContactPresent(false), reducedMotion ? 0 : 550);
    return () => window.clearTimeout(timer);
  }, [contactOpen, contactPresent]);

  useEffect(() => {
    if (!overlayOpen) return;
    setBackgroundScrollLocked(true);
    const lockedX = window.scrollX;
    const lockedY = window.scrollY;
    const preventBackgroundScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".menu-panel, .contact-panel")) return;
      if (event.cancelable) event.preventDefault();
    };
    const keepPagePosition = () => {
      if (Math.abs(window.scrollY - lockedY) > 0.5 || Math.abs(window.scrollX - lockedX) > 0.5) {
        window.scrollTo({ left: lockedX, top: lockedY, behavior: "instant" });
      }
    };
    window.addEventListener("wheel", preventBackgroundScroll, { capture: true, passive: false });
    window.addEventListener("touchmove", preventBackgroundScroll, { capture: true, passive: false });
    window.addEventListener("scroll", keepPagePosition, { passive: true });
    return () => {
      window.removeEventListener("wheel", preventBackgroundScroll, true);
      window.removeEventListener("touchmove", preventBackgroundScroll, true);
      window.removeEventListener("scroll", keepPagePosition);
      setBackgroundScrollLocked(false);
    };
  }, [overlayOpen]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const item of navigationItems) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= threshold) current = item.id;
      }
      setActiveSection(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  const openMenu = useCallback(() => setMenuOpen((current) => !current), []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const panel = menuRef.current?.querySelector(".menu-panel");
      if (panel?.contains(target) || menuToggleRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [menuOpen]);

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
    const focusable = () => [
      ...(menuOpen ? (headerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []) : []),
      ...(panel?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea') ?? []),
    ];
    (menuOpen ? menuToggleRef.current : focusable()[0])?.focus({ preventScroll: true });
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
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [contactOpen, menuOpen]);

  const closeAll = () => {
    setContactOpen(false);
    setMenuOpen(false);
  };

  const navigateToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) {
      closeAll();
      return;
    }
    event.preventDefault();
    closeAll();
    if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
    // Give the menu's scroll lock time to clear before starting the transition.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(target)));
  };

  return (
    <InteractionContext.Provider value={{ openContact, openMenu }}>
      <a className="skip-link" href="#main-content">К основному содержимому</a>
      <header className={`site-header${menuOpen ? " menu-is-open" : ""}`} ref={headerRef}>
        <a aria-label="На главную JustFront" className="brand-link" href="#top">
          <Image alt="" height={763} src="/sites/mk-studio/brand/justfront-mark.svg" width={788} /><span className="brand-name"><SplitHoverText>JustFront</SplitHoverText></span>
        </a>
        <div className="header-actions">
          <button className="talk-pill" onClick={openContact} type="button"><SplitHoverText>ОБСУДИТЬ ПРОЕКТ</SplitHoverText></button>
          <button
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            className="menu-pill"
            onClick={openMenu}
            ref={menuToggleRef}
            type="button"
          >
            <SplitHoverText key={menuOpen ? "close" : "menu"}>{menuOpen ? "ЗАКРЫТЬ" : "МЕНЮ"}</SplitHoverText><span aria-hidden="true">{menuOpen ? " ×" : " ㆔"}</span>
          </button>
        </div>
      </header>

      {children}

        <div
          aria-hidden={!menuOpen}
          className={`menu-layer${menuOpen ? " is-open" : ""}`}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setMenuOpen(false);
          }}
          ref={menuRef}
        >
          <nav aria-label="Основная навигация" className="menu-panel" data-lenis-prevent id="site-navigation">
            <p className="eyebrow">JUSTFRONT · FRONTEND И AI</p>
            {navigationItems.map((item) => (
              <a aria-current={activeSection === item.id ? "location" : undefined} className="menu-link" href={`#${item.target}`} key={item.id} onClick={(event) => navigateToSection(event, item.target)} tabIndex={menuOpen ? undefined : -1}>
                <SplitHoverText>{item.label}</SplitHoverText><span className="menu-index">{item.number}</span>
              </a>
            ))}
            <button className="menu-link" onClick={openContact} tabIndex={menuOpen ? undefined : -1} type="button"><SplitHoverText>Связаться</SplitHoverText><span className="menu-index">05</span></button>
            <div className="menu-footer">
              <p>Разработка сайтов.<br />Веб-приложения.<br />AI-интеграции.</p>
              <a href="https://t.me/justfront" rel="noopener noreferrer" tabIndex={menuOpen ? undefined : -1} target="_blank"><SplitHoverText>TELEGRAM<br />@justfront</SplitHoverText></a>
            </div>
          </nav>
        </div>

      {contactPresent && (
        <div aria-hidden={!contactOpen} className="contact-layer" onMouseDown={(event) => event.target === event.currentTarget && closeAll()} ref={contactRef}>
          <section aria-labelledby="contact-title" aria-modal="true" className="contact-panel" data-lenis-prevent role="dialog">
            <button aria-label="Закрыть контакты" className="contact-close contact-close-pill" onClick={closeAll} type="button"><SplitHoverText>ЗАКРЫТЬ</SplitHoverText><span aria-hidden="true">×</span></button>
            <p className="eyebrow">JUSTFRONT · СВЯЗЬ</p>
            <h2 id="contact-title">Обсудим задачу.</h2>
            <p className="contact-intro">Расскажите о задаче — свяжусь с вами и обсудим детали.</p>
            <ContactForm />
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
