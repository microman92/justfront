"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

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
  const [contactOpen, setContactOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const openContact = useCallback(() => {
    setMenuOpen(false);
    setContactOpen(true);
  }, []);
  const openMenu = useCallback(() => setMenuOpen((current) => !current), []);

  useEffect(() => {
    const audio = new Audio("/sites/trionn/sound/thunder.mp3");
    audio.loop = true;
    audio.volume = 0.08;
    audio.preload = "none";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (soundOn) {
      audio.pause();
      setSoundOn(false);
      return;
    }
    try {
      await audio.play();
      setSoundOn(true);
    } catch {
      setSoundOn(false);
    }
  };

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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a aria-label="Trionn home" className="brand-link" href="#top">
          <Image alt="Trionn" height={25} priority src="/sites/trionn/brand/logo.svg" width={94} />
        </a>
        <div className="header-actions">
          <button
            aria-label={soundOn ? "Mute sound" : "Enable sound"}
            aria-pressed={soundOn}
            className="sound-toggle"
            onClick={() => void toggleSound()}
            type="button"
          >
            <span aria-hidden="true">{soundOn ? "◖" : "◗"}</span>
          </button>
          <button className="talk-pill" onClick={openContact} type="button">LET&apos;S TALK</button>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="menu-pill"
            onClick={openMenu}
            type="button"
          >
            {menuOpen ? "CLOSE" : "MENU"}<span aria-hidden="true">{menuOpen ? " ×" : " ㆔"}</span>
          </button>
        </div>
      </header>

      {children}

      {menuOpen && (
        <div className="menu-layer" onMouseDown={(event) => event.target === event.currentTarget && closeAll()}>
          <nav aria-label="Main navigation" className="menu-panel">
            <button aria-label="Close menu" className="contact-close menu-close" onClick={closeAll} type="button">×</button>
            <p className="eyebrow">INDEPENDENT DIGITAL STUDIO · EST. 2012</p>
            <a href="#work" onClick={closeAll}>Work <span>01</span></a>
            <a href="#services" onClick={closeAll}>Services <span>02</span></a>
            <a href="#about" onClick={closeAll}>About <span>03</span></a>
            <button onClick={openContact} type="button">Contact <span>04</span></button>
            <div className="menu-footer">
              <p>Three ideas. One vision.<br />Meaningful digital experiences.</p>
              <a href="mailto:hello@trionn.com">hello@trionn.com</a>
            </div>
          </nav>
        </div>
      )}

      {contactOpen && (
        <div className="contact-layer" onMouseDown={(event) => event.target === event.currentTarget && closeAll()}>
          <section aria-labelledby="contact-title" aria-modal="true" className="contact-panel" role="dialog">
            <button aria-label="Close contact form" className="contact-close" onClick={closeAll} type="button">×</button>
            <h2 id="contact-title">Let&apos;s build something great.</h2>
            <p className="contact-intro">Tell us about your project, we usually reply within one business day.</p>
            <form action="mailto:hello@trionn.com" encType="text/plain" method="post">
              <label><span>Full Name</span><input autoComplete="name" name="name" placeholder="Full Name" required /></label>
              <label><span>Email address</span><input autoComplete="email" name="email" placeholder="Email address" required type="email" /></label>
              <label><span>Company / Website name</span><input autoComplete="organization" name="company" placeholder="Company / Website name" /></label>
              <label><span>What do you need?</span>
                <select defaultValue="" name="service" required>
                  <option disabled value="">Select a service</option>
                  <option>Website Design & Development</option>
                  <option>UI/UX Design</option>
                  <option>Web Development</option>
                  <option>Mobile App Design</option>
                  <option>Branding & Identity</option>
                  <option>AI-Powered Digital Product</option>
                  <option>Something Else</option>
                </select>
              </label>
              <label className="message-label"><span>Project details</span><textarea name="message" placeholder="Share a little about your goals, timeline, and requirements..." rows={3} /></label>
              <label><span>Project budget</span>
                <select defaultValue="" name="budget">
                  <option disabled value="">Select your estimated budget</option>
                  <option>$5K - $15K</option><option>$15K - $30K</option><option>$30K - $60K</option><option>$60K+</option><option>Not sure yet</option>
                </select>
              </label>
              <button className="form-submit" type="submit">SEND INQUIRY <span>↗</span></button>
            </form>
            <div className="contact-alternative"><span>OR</span><a href="https://calendly.com/hello-trionn/30min">BOOK A 30-MINUTE CALL</a><p className="contact-direct">Prefer email? <a href="mailto:hello@trionn.com">hello@trionn.com</a></p></div>
          </section>
        </div>
      )}
    </InteractionContext.Provider>
  );
}
