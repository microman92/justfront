import { projects } from "./content";
import { ContactTrigger, SiteInteractionShell } from "./interaction-shell";
import { IntroSequence } from "./intro-sequence";
import { SiteMotion } from "./site-motion";
import { ReviewsScene } from "./visual-sections";
import { KeyFacts } from "./key-facts";
import { AboutPortrait } from "./about-portrait";
import { LocalTime } from "./local-time";
import { MotionGallery } from "./motion-gallery";
import { FooterArt } from "./footer-art";
import { SplitHoverText } from "./split-hover-text";

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <FooterArt />
      <div className="footer-top"><div><p>JUSTFRONT · ПОРТФОЛИО</p><h2>Сайты, веб-приложения,<br />AI-интеграции.</h2></div><div className="footer-actions"><p className="footer-time">ТАШКЕНТ → <LocalTime /></p><div className="footer-cta"><ContactTrigger className="footer-discuss"><SplitHoverText>ОБСУДИТЬ ПРОЕКТ</SplitHoverText><span aria-hidden="true">→</span></ContactTrigger><a href="#work"><SplitHoverText>МОИ ПРОЕКТЫ</SplitHoverText><span aria-hidden="true">↑</span></a></div></div></div>
      <div className="footer-contact-grid"><div className="footer-copyright"><p>© 2026 JUSTFRONT · МИХАИЛ КУДРИЦКИЙ</p><p>FRONTEND-РАЗРАБОТЧИК · ТАШКЕНТ / УДАЛЁННО</p></div><div><span className="eyebrow">КОНТАКТ</span><a href="mailto:goody-man@bk.ru"><SplitHoverText>goody-man@bk.ru</SplitHoverText></a><a href="https://t.me/justfront" rel="noopener noreferrer" target="_blank"><SplitHoverText>TELEGRAM · @justfront</SplitHoverText></a></div><div><span className="eyebrow">PROWEB</span><span>Преподавал Frontend</span><span>Сейчас веду AI-направления</span></div></div>
    </footer>
  );
}

export function MKStudioHome() {
  return (
    <SiteInteractionShell>
      <SiteMotion>
        <main id="main-content">
          <IntroSequence>
            <KeyFacts />
          </IntroSequence>
          <MotionGallery projects={projects} />
          <AboutPortrait />
          <ReviewsScene />
        </main>
        <Footer />
      </SiteMotion>
    </SiteInteractionShell>
  );
}

