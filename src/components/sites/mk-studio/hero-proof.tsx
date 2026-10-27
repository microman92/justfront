import styles from "./hero-proof.module.css";

export function HeroProof() {
  return (
    <div
      aria-label="Более 300 учеников. Преподаю Frontend и AI в PROWEB с 2021 года"
      className={styles.proof}
      role="group"
    >
      <div className={styles.metric}>
        <span className={styles.kicker}>
          <i aria-hidden="true" />ОБУЧЕНИЕ
        </span>
        <strong className={styles.value}>
          300<span className={styles.plus}>+</span>
        </strong>
        <span className={styles.caption}>УЧЕНИКОВ</span>
      </div>
      <div className={styles.teaching}>
        <span className={styles.kicker}>ПРЕПОДАВАТЕЛЬ · PROWEB</span>
        <p className={styles.direction}>
          <span>Frontend</span>
          <span aria-hidden="true" className={styles.arrow}>→</span>
          <span>AI</span>
        </p>
        <span className={styles.caption}>С 2021 ГОДА</span>
      </div>
    </div>
  );
}
