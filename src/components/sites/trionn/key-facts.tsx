"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { awards, partners } from "./content";

function FactVideo({ name }: { name: "awards" | "team" }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current!;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    element.src = `/sites/trionn/video/${name}${window.innerWidth <= 767 ? "-mobile" : ""}.mp4`;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !media.matches) void element.play().catch(() => { element.controls = true; });
      else element.pause();
    });
    observer.observe(element);
    const stop = () => { if (media.matches) element.pause(); };
    media.addEventListener("change", stop);
    return () => { observer.disconnect(); element.pause(); media.removeEventListener("change", stop); };
  }, [name]);
  return <video aria-hidden="true" className="fact-video" loop muted playsInline preload="metadata" ref={video} />;
}

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
        gsap.to(state, { value, duration: 1.7, ease: "power3.out", scrollTrigger: { trigger: element.current, start: "top 90%", toggleActions: "restart none none reset" }, onUpdate: () => {
          if (element.current) element.current.textContent = value < 10 ? state.value.toFixed(1) : String(Math.round(state.value));
        } });
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
          end: () => `+=${window.innerHeight}`,
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
  return <section aria-labelledby="facts-title" className="facts-section" id="keyfacts" ref={section}>
    <div className="facts-intro"><h2 id="facts-title">Key facts</h2><p>A snapshot of our<br />experience and impact.</p></div>
    <div className="facts-grid" tabIndex={0} aria-label="Key fact cards">
      <div className="fact-block fact-awards"><FactVideo name="awards" /><span className="fact-label">FEATURED &amp; AWARDS</span><div className="fact-bottom"><div><div className="award-logos">{awards.map(([name, src]) => <Image alt={name} height={36} key={name} src={src} width={72} />)}</div><p>Featured on top design<br />platforms worldwide.</p></div><RollingValue label="50 plus featured awards" value={50} /></div></div>
      <div className="fact-block fact-projects"><span className="fact-label">PROJECTS COMPLETED</span><div className="fact-counter-circle"><RollingValue label="1.5 thousand plus projects" suffix="K+" value={1.5} /></div><p>90% of our clients seek our<br />services for a second project.</p></div>
      <div className="fact-block fact-team"><span className="fact-label">OUR TEAM MEMBERS</span><FactVideo name="team" /><div className="fact-bottom"><p>Different skills.<br />One standard.</p><RollingValue label="20 plus team members" value={20} /></div></div>
    </div>
    <div className="partner-row"><p>OUR BUSINESS PARTNERS</p><div>{partners.map((src, index) => <Image alt={`Business partner ${index + 1}`} height={28} key={src} src={src} width={104} />)}</div></div>
  </section>;
}
