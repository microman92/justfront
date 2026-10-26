import { projects } from "./content";
import { ContactTrigger, SiteInteractionShell } from "./interaction-shell";
import { IntroSequence } from "./intro-sequence";
import { SiteMotion } from "./site-motion";
import { ProjectRail, ServiceScene } from "./visual-sections";
import { KeyFacts } from "./key-facts";
import { AboutScene } from "./intro-scenes";
import { LocalTime } from "./local-time";
import { MotionGallery } from "./motion-gallery";
import { FooterArt } from "./footer-art";

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <FooterArt />
      <div className="footer-top"><div><p>JUSTFRONT · ПОРТФОЛИО</p><h2>Сайты, веб-приложения,<br />AI-интеграции.</h2></div><div className="footer-actions"><p className="footer-time">ТАШКЕНТ → <LocalTime /></p><div className="footer-cta"><ContactTrigger className="footer-discuss">ОБСУДИТЬ ПРОЕКТ <span aria-hidden="true">→</span></ContactTrigger><a href="#work">МОИ ПРОЕКТЫ <span aria-hidden="true">↑</span></a></div></div></div>
      <div className="footer-contact-grid"><div className="footer-copyright"><p>© 2026 JUSTFRONT · МИХАИЛ КУДРИЦКИЙ</p><p>FRONTEND-РАЗРАБОТЧИК · ТАШКЕНТ / УДАЛЁННО</p></div><div><span className="eyebrow">КОНТАКТ</span><a href="mailto:goody-man@bk.ru">goody-man@bk.ru</a><a href="https://t.me/justfront" rel="noopener noreferrer" target="_blank">TELEGRAM · @justfront</a></div><div><span className="eyebrow">PROWEB</span><span>Преподавал Frontend</span><span>Сейчас веду AI-направления</span></div></div>
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
          <ProjectRail projects={projects} />
          <ServiceScene />
          <AboutScene />
          <MotionGallery />
        </main>
        <Footer />
      </SiteMotion>
    </SiteInteractionShell>
  );
}

