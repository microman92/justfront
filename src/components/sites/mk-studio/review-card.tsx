import Image from "next/image";
import { MessageSquareText } from "lucide-react";
import type { ReviewSlot } from "./review-slots";
import styles from "./reviews.module.css";

export function ReviewCard({ review, index }: { review: ReviewSlot; index: number }) {
  return <>
    <div className={styles.header}><span>{String(index + 1).padStart(2, "0")} / {review.category}</span><span>{review.source ?? "СКОРО"}</span></div>
    <div className={styles.proof}>
      {review.screenshot ? <Image src={review.screenshot} alt={`Оригинал отзыва${review.author ? `: ${review.author}` : ""}`} fill sizes="(max-width: 767px) 32vw, 15vw" /> : <><MessageSquareText size={30} strokeWidth={1} aria-hidden="true" /><span>Скриншот отзыва</span><small>Ожидает добавления</small></>}
    </div>
    <div className={styles.copy}>
      <h3>{review.title}</h3>
      {review.quote ? <blockquote>{review.quote}</blockquote> : <p className={styles.pending}>Здесь появится отзыв {review.id === "client" ? "о разработке сайта" : "об обучении"}.</p>}
      <div className={styles.author}>{review.author ? <span>{review.author}</span> : <span>Автор будет указан вместе с отзывом</span>}</div>
      {review.sourceUrl && <a className={styles.source} href={review.sourceUrl} target="_blank" rel="noopener noreferrer">ЧИТАТЬ В ИСТОЧНИКЕ <span aria-hidden="true">↗</span></a>}
    </div>
  </>;
}
