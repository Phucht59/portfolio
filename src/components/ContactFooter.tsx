import { Github, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CONTACT_EMAIL, GITHUB_PROFILE, site } from "../content/projects";
import { Reveal } from "./Reveal";
import type { Locale } from "../content/types";

export function ContactFooter({ headline = true }: { headline?: boolean }) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;

  return (
    <footer id="contact" className="site-footer">
      <div className="container site-footer__inner">
        {headline ? (
          <Reveal y={16}>
            <p className="site-footer__headline">{t("home.footerHeadline")}</p>
          </Reveal>
        ) : (
          <span className="sr-only">{t("nav.home")}</span>
        )}
        <Reveal delay={0.06}>
          <address className="contact-list">
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <Mail aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer">
              <Github aria-hidden="true" />
              github.com/Phucht59
            </a>
            <span>
              <MapPin aria-hidden="true" />
              {site.location[locale]}
            </span>
          <a href="#main" className="back-top">{locale === "vi" ? "Về đầu trang ↑" : "Back to top ↑"}</a>
          </address>
        </Reveal>
      </div>
    </footer>
  );
}
