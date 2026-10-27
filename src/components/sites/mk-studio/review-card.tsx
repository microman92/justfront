import Image from "next/image";
import { MessageSquareText } from "lucide-react";
import type { ReviewSlot } from "./review-slots";
import styles from "./reviews.module.css";

export function ReviewCard({ review, index, onOpen }: { review: ReviewSlot; index: number; onOpen: (review: ReviewSlot) => void }) {
  return <>
    <button className={styles.openCard} type="button" onClick={() => onOpen(review)} aria-label={`Открыть отзыв: ${review.author}`} />
    <div className={styles.header}><span>{String(index + 1).padStart(2, "0")} / {review.category}</span><span>{review.source}</span></div>
    <div className={styles.proof}>
      {review.screenshot ? <div className={styles.screenshot}><Image src={review.screenshot} alt="" fill sizes="(max-width: 767px) 90vw, 52vw" unoptimized /></div> : <><MessageSquareText size={30} strokeWidth={1} aria-hidden="true" /><span>Личная переписка</span><small>TELEGRAM · ОТКРЫТЬ ↗</small></>}
    </div>
  </>;
}
