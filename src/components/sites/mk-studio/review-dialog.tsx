"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import type { ReviewSlot } from "./review-slots";
import { setBackgroundScrollLocked } from "./smooth-scroll";
import { SplitHoverText } from "./split-hover-text";
import styles from "./reviews.module.css";

export function ReviewDialog({ review, onClose }: { review: ReviewSlot; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    setBackgroundScrollLocked(true);
    closeButton.current?.focus({ preventScroll: true });

    const preventBackgroundScroll = (event: Event) => {
      if (event.target instanceof Node && panel.current?.contains(event.target)) return;
      if (event.cancelable) event.preventDefault();
    };
    const keepPagePosition = () => {
      if (Math.abs(window.scrollY - scrollY) > 0.5 || Math.abs(window.scrollX - scrollX) > 0.5) {
        window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setClosing(true);
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
      }
    };
    window.addEventListener("wheel", preventBackgroundScroll, { capture: true, passive: false });
    window.addEventListener("touchmove", preventBackgroundScroll, { capture: true, passive: false });
    window.addEventListener("scroll", keepPagePosition, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", preventBackgroundScroll, true);
      window.removeEventListener("touchmove", preventBackgroundScroll, true);
      window.removeEventListener("scroll", keepPagePosition);
      document.removeEventListener("keydown", onKeyDown);
      setBackgroundScrollLocked(false);
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!closing) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(onClose, reducedMotion ? 0 : 320);
    return () => window.clearTimeout(timer);
  }, [closing, onClose]);

  return createPortal(
    <div className={`${styles.modalBackdrop}${closing ? ` ${styles.modalClosing}` : ""}`} onPointerDown={(event) => { if (event.target === event.currentTarget) setClosing(true); }}>
      <div ref={panel} className={styles.modalPanel} role="dialog" aria-modal="true" aria-labelledby="review-dialog-title" data-lenis-prevent>
        <div className={styles.modalTop}>
          <span>{review.category} / {review.source}</span>
          <button ref={closeButton} className={styles.modalClose} onClick={() => setClosing(true)} type="button"><SplitHoverText>ЗАКРЫТЬ</SplitHoverText><span aria-hidden="true">×</span></button>
        </div>
        <h2 id="review-dialog-title">{review.author}</h2>
        {review.screenshot ? <div className={styles.modalImage}>
          <Image src={review.screenshot} alt={`Скриншот отзыва: ${review.author}`} width={1140} height={800} unoptimized />
        </div> : <blockquote className={styles.modalQuote}>«{review.fullText ?? review.quote}»</blockquote>}
        <div className={styles.modalBottom}><span>JUSTFRONT / ОТЗЫВЫ</span><span>{review.source}</span></div>
      </div>
    </div>, document.body,
  );
}
