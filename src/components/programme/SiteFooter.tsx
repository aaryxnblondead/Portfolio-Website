import { ContactForm } from "@/components/ContactForm";
import { PataphysicalLink } from "./PataphysicalLink";

/**
 * The one site footer, identical on every page: coordinates and channels
 * on the left, the contact form on the right. Carries id="contact" so
 * every nav Contact link lands on the form.
 */
export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="site-footer-grid">
        <div>
          <p
            className="pMono"
            style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--accent)" }}
          >
            CONTACT — OPEN CHANNEL
          </p>
          <p style={{ marginTop: 12 }}>
            <PataphysicalLink href="mailto:aaryansingh2810@gmail.com">
              aaryansingh2810@gmail.com
            </PataphysicalLink>
          </p>
          <p className="site-footer-links">
            <a href="https://github.com/aaryxnblondead/" target="_blank" rel="noreferrer noopener">
              github ↗
            </a>
            <a
              href="https://www.linkedin.com/in/aaryan-singh-1b068828b/"
              target="_blank"
              rel="noreferrer noopener"
            >
              linkedin ↗
            </a>
          </p>
          <p className="site-footer-meta">Mumbai · 19°04′N 72°52′E</p>
        </div>
        <ContactForm />
      </div>
    </footer>
  );
}
