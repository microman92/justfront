"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "./content";
import { ContactTrigger } from "./interaction-shell";

export function Testimonials() {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const paused = useRef(false);
  const visible = useRef(false);
  const touchStart = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    if (section.current) observer.observe(section.current);
    const timer = window.setInterval(() => {
      if (visible.current && !paused.current && !document.hidden) setActive((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, []);

  const change = (step: number) => setActive((current) => (current + step + testimonials.length) % testimonials.length);

  return (
    <section aria-labelledby="testimonials-title" className="testimonials-section" id="testimonials" ref={section}>
      <div className="testimonials-heading"><h2 id="testimonials-title">Client stories</h2><p>Great work is built through<br />partnership. Here&apos;s what<br />our clients say.</p></div>
      <div className="testimonial-layout">
        <nav aria-label="Choose a client story" className="testimonial-clients">
          {testimonials.map((item, index) => <button aria-current={active === index ? "true" : undefined} className={active === index ? "is-active" : ""} key={item.client} onClick={() => setActive(index)} type="button">{item.client}<span>↗</span></button>)}
        </nav>
        <div className="testimonial-slides" onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }} onFocusCapture={() => { paused.current = true; }} onBlurCapture={() => { paused.current = false; }} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { const delta = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 48) change(delta < 0 ? 1 : -1); }}>
        {testimonials.map((quote, index) => <article aria-hidden={active !== index} inert={active !== index} className={`testimonial-card${active === index ? " is-active" : ""}`} key={quote.client}>
          <blockquote>{quote.quote}</blockquote>
          <div className="testimonial-author"><Image alt="" height={72} src={quote.portrait} width={72} /><div><strong>{quote.name}</strong><span>{quote.role}</span></div><button aria-label="Testimonial audio is unavailable in this local study" className="listen-button" disabled type="button">▷ <span>LISTEN TO HIM!</span></button></div>
          <ContactTrigger className="underlined-link become-client">BECOME A CLIENT <span aria-hidden="true">→</span></ContactTrigger>
        </article>)}
        </div>
      </div>
      <div className="testimonial-controls"><button aria-label="Previous testimonial" onClick={() => change(-1)} type="button">←</button><button aria-label="Next testimonial" onClick={() => change(1)} type="button">→</button></div>
    </section>
  );
}
