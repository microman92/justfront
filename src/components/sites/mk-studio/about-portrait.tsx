import { ContactTrigger } from "./interaction-shell";
import { HologramPortrait } from "./hologram-portrait";
import styles from "./about-portrait.module.css";

export function AboutPortrait() {
  return <section className={styles.section} id="about" aria-labelledby="about-title" itemScope itemType="https://schema.org/Person">
    <div className={styles.layout}>
      <div className={styles.topline}><span>ОБО МНЕ / JUSTFRONT</span><span>ТАШКЕНТ · РАБОТАЮ УДАЛЁННО</span></div>
      <div className={styles.copy}>
        <p className={styles.eyebrow} itemProp="jobTitle">ВЕБ-РАЗРАБОТЧИК И ПРЕПОДАВАТЕЛЬ</p>
        <h2 id="about-title">Веб-разработчик<br /><span>для вашего бизнеса.</span></h2>
        <p className={styles.lead} itemProp="description">Я <span itemProp="name">Михаил Кудрицкий</span>, веб-разработчик в Ташкенте. С 2023 года создаю сайты и веб-приложения для бизнеса: от первого экрана до интеграций и запуска.</p>
        <p className={styles.description}>Разрабатываю на React, Next.js, Vue и Nuxt. Собираю CRM-системы, Telegram-ботов и Mini Apps, подключаю AI-инструменты к рабочим процессам. Помогаю выбрать решение под вашу задачу, согласовать объём работ и пройти путь до готового продукта.</p>
        <div className={styles.teaching}>
          <span className={styles.teachingLabel}>ПРЕПОДАВАТЕЛЬ / PROWEB</span>
          <p>Преподаю с 2021 года: начинал с Frontend, сейчас веду AI-направления. Объясняю сложные вещи простым языком — на занятиях и при обсуждении вашего проекта.</p>
          <div className={styles.facts}><span><strong>300+</strong> учеников</span><span><strong>2021</strong> начало преподавания</span></div>
        </div>
        <div className={styles.actions}>
          <ContactTrigger className={styles.contact}>ОБСУДИТЬ ЗАДАЧУ <span aria-hidden="true">↗</span></ContactTrigger>
          <a href="https://t.me/justfront" target="_blank" rel="noopener noreferrer">НАПИСАТЬ В TELEGRAM <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <figure className={styles.portrait}>
        <HologramPortrait />
        <figcaption><span>FRONTEND / AI</span></figcaption>
      </figure>
    </div>
  </section>;
}
