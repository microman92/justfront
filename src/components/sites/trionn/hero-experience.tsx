"use client";

import { useEffect, useState } from "react";
import { ContactTrigger } from "./interaction-shell";

const words = ["something", "depth", "impact", "purpose", "intention"];

function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function HeroExperience() {
  const reducedMotion = useReducedMotion();
  const [displayedWord, setDisplayedWord] = useState(words[0]);
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    if (reducedMotion) {
      const reset = window.setTimeout(() => { setDisplayedWord(words[0]); setCurrentWord(words[0]); }, 0);
      return () => window.clearTimeout(reset);
    }
    let index = 0;
    let scrambleTimer: number | undefined;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>";
    const timer = window.setInterval(() => {
      index = (index + 1) % words.length;
      const nextWord = words[index];
      const start = performance.now();
      setCurrentWord(nextWord);
      scrambleTimer = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - start) / 1050);
        const revealed = Math.floor(nextWord.length * progress);
        setDisplayedWord(nextWord.split("").map((letter, position) => position < revealed ? letter : glyphs[Math.floor(Math.random() * glyphs.length)]).join(""));
        if (progress === 1) window.clearInterval(scrambleTimer);
      }, 65);
    }, 3800);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(scrambleTimer);
    };
  }, [reducedMotion]);

  return (
    <section
      aria-labelledby="hero-title"
      className="hero-section"
      id="top"
    >
      <div className="hero-copy">
        <p className="hero-pretitle">AN INDEPENDENT DIGITAL STUDIO</p>
        <h1 id="hero-title">Designed to<br />mean <span aria-label={currentWord} className="rotating-word" style={{ animation: "none" }}><span aria-hidden="true">{displayedWord}</span></span><span className="hero-period">.</span></h1>
        <div className="hero-links">
          <ContactTrigger className="text-link">DISCUSS YOUR PROJECT <span aria-hidden="true">→</span></ContactTrigger>
          <a className="text-link" href="https://calendly.com/hello-trionn/30min">BOOK A 30-MINUTE CALL <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className="hero-bottom">
        <div aria-label="Established 2012; more than fourteen years shaping digital direction" className="hero-proof">
          <span><b>◉</b> EST. 2012</span>
          <span>14+ YEARS SHAPING<br />DIGITAL DIRECTION.</span>
        </div>
        <p className="hero-summary">Websites, AI products, brands, and systems built for clarity, scale and impact.</p>
      </div>
      <p aria-hidden="true" className="hero-instruction">HOLD TO <span>✦</span> BLAST</p>
      <a aria-label="Scroll to discover" className="hero-scroll" href="#about">↓</a>
    </section>
  );
}
