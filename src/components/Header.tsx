import { motion } from "motion/react";
import { Menu, Pause, Play, Sun, Moon } from "lucide-react";
import { useScenePreferences } from "./scene/ScenePreferences";
import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { CV_ENABLED, CONTACT_EMAIL } from "../content/projects";
import { persistLocale } from "../i18n";
import { useUi } from "../app/UiContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { Locale } from "../content/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const { t, i18n } = useTranslation();
  const effects = useScenePreferences();
  const page = useLocation();
  const home = page.pathname === "/";
  const { overlayOpen, openOverlay, triggerRef } = useUi();
  const reduced = usePrefersReducedMotion();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;

  const setLocale = (next: Locale) => {
    void i18n.changeLanguage(next);
    persistLocale(next);
    document.documentElement.lang = next;
    document.title = t("meta.title");
  };

  return (
    <motion.header
      className="site-header"
      initial={reduced ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.1 : 0.42, ease }}
    >
      <div className="container site-header__inner">
        <NavLink to="/" className="wordmark">
          PHUC
        </NavLink>
        <nav className="site-nav" aria-label="Primary">
          <a href="/#work">{t("nav.work")}</a>
          <a href="/#about">{t("nav.about")}</a>
          {CV_ENABLED ? (
            <a href="/#resume">{t("nav.resume")}</a>
          ) : (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Portfolio%20CV%20request`}
            >
              {t("nav.resume")}
            </a>
          )}
          <a href="/#contact">{locale === "vi" ? "Liên hệ" : "Contact"}</a>
        </nav>
        <div className="header-tools">
          {home ? <button id="world-theme" type="button" className="icon-btn" onClick={effects.toggleTheme} aria-pressed={effects.night} aria-label={locale === "vi" ? (effects.night ? "Chế độ ban ngày" : "Chế độ ánh trăng") : (effects.night ? "Day mode" : "Moonlight mode")}>
            <span>{effects.night ? "Night" : "Day"}</span>{effects.night ? <Moon size={17} /> : <Sun size={17} />}
          </button> : null}
          <button
            type="button"
            className="icon-btn"
            disabled={effects.reduced}
            aria-pressed={effects.paused || effects.reduced}
            onClick={effects.toggle}
            aria-label={
              effects.reduced
                ? locale === "vi"
                  ? "Giảm chuyển động theo thiết bị"
                  : "System reduced motion"
                : effects.paused
                  ? locale === "vi"
                    ? "Tiếp tục chuyển động"
                    : "Resume animation"
                  : locale === "vi"
                    ? "Tạm dừng chuyển động"
                    : "Pause animation"
            }
          >
            {effects.paused || effects.reduced ? (
              <Play size={16} strokeWidth={2.2} />
            ) : (
              <Pause size={16} strokeWidth={2.2} />
            )}
          </button>
          <div
            className="lang-switch"
            role="group"
            aria-label={t("lang.group")}
          >
            <button
              type="button"
              aria-pressed={locale === "en"}
              onClick={() => setLocale("en")}
            >
              {t("lang.en")}
            </button>
            <span className="lang-switch__rule" aria-hidden="true">
              |
            </span>
            <button
              type="button"
              aria-pressed={locale === "vi"}
              onClick={() => setLocale("vi")}
            >
              {t("lang.vi")}
            </button>
          </div>
          <button
            ref={triggerRef}
            type="button"
            className="icon-btn"
            aria-haspopup="dialog"
            aria-expanded={overlayOpen}
            aria-label={t("nav.openIndex")}
            onClick={openOverlay}
          >
            <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
