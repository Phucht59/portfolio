import { motion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CV_ENABLED, CONTACT_EMAIL, site } from "../content/projects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { Locale } from "../content/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t, i18n } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;
  const delay = (index: number) => (reduced ? 0 : index * 0.05);

  return (
    <section id="hero" className="hero" aria-labelledby="hero-name">
      <div className="hero__copy">
        <motion.h1
          id="hero-name"
          className="hero__name"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0.08 : 0.48,
            delay: delay(0),
            ease,
          }}
        >
          <span>TRAN</span><span>HOANG</span><span data-phuc-obstacle>PHUC</span>
        </motion.h1>
        <motion.p
          className="hero__role"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0.08 : 0.48,
            delay: delay(1),
            ease,
          }}
        >
          {site.role[locale]}
        </motion.p>
        <motion.p
          className="hero__intro"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0.08 : 0.48,
            delay: delay(2),
            ease,
          }}
        >
          {site.intro[locale]}
        </motion.p>
        <motion.p
          className="hero__meta"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0.08 : 0.48,
            delay: delay(3),
            ease,
          }}
        >
          {site.location[locale]} · {site.availability[locale]}
        </motion.p>
        <motion.div
          className="btn-row hero__actions"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduced ? 0.08 : 0.48,
            delay: delay(4),
            ease,
          }}
        >
          <a className="btn btn--primary" href="#work">
            {t("hero.viewWork")}
            <ArrowRight aria-hidden="true" />
          </a>
          {CV_ENABLED ? (
            <a className="btn btn--ghost" href="/cv.pdf">
              {t("hero.downloadCv")}
              <ArrowDown aria-hidden="true" />
            </a>
          ) : (
            <a
              className="btn btn--ghost"
              href={`mailto:${CONTACT_EMAIL}?subject=Portfolio%20CV%20request`}
            >
              {locale === "vi" ? "Nhận CV" : "Request CV"}
              <ArrowRight aria-hidden="true" />
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
