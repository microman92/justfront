import { projects } from "./content";
import { ContactTrigger, SiteInteractionShell } from "./interaction-shell";
import { IntroSequence } from "./intro-sequence";
import { SiteMotion } from "./site-motion";
import { ProjectRail, ServiceScene } from "./visual-sections";
import { KeyFacts } from "./key-facts";
import { LocalTime } from "./local-time";
import { MotionGallery } from "./motion-gallery";
import { Testimonials } from "./testimonials";
import { FooterArt } from "./footer-art";

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <FooterArt />
      <div className="footer-top"><div><p>LET&apos;S BUILD WORK THAT INSPIRES.</p><h2>Ready to build<br />something bold?</h2></div><div className="footer-actions"><p className="footer-time">IST → <LocalTime /></p><div className="footer-cta"><ContactTrigger className="footer-discuss">DISCUSS YOUR PROJECT <span aria-hidden="true">→</span></ContactTrigger><a href="https://calendly.com/hello-trionn/30min">BOOK A 30-MINUTE CALL <span aria-hidden="true">→</span></a></div></div></div>
      <div className="footer-contact-grid"><div className="footer-copyright"><p>©TRIONN® 2026</p><p>SOUND ON ♫ HOVER THE LINES.</p></div><div><span className="eyebrow">BUSINESS ENQUIRY</span><a href="mailto:hello@trionn.com">E. hello@trionn.com</a><a href="tel:+919824182099">P. +91 98241 82099</a></div><div><span className="eyebrow">SOCIAL</span><div className="footer-social"><a href="https://www.linkedin.com/company/trionnstudio/">Linkedin</a><a href="https://www.facebook.com/trionnstudio">Facebook</a><a href="https://dribbble.com/trionnstudio">Dribbble</a><a href="https://www.instagram.com/trionnstudio/">Instagram</a></div></div></div>
    </footer>
  );
}

export function TrionnHome() {
  return (
    <SiteInteractionShell>
      <SiteMotion>
        <main id="main-content">
          <IntroSequence />
          <KeyFacts />
          <ProjectRail projects={projects} />
          <ServiceScene />
          <Testimonials />
          <MotionGallery />
        </main>
        <Footer />
      </SiteMotion>
    </SiteInteractionShell>
  );
}

