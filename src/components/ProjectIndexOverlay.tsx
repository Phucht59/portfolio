import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { projects } from "../content/projects";
import { useUi } from "../app/UiContext";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { Locale } from "../content/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectIndexOverlay() {
  const { t, i18n } = useTranslation();
  const { overlayOpen, closeOverlay, triggerRef } = useUi();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;

  useFocusTrap(overlayOpen, dialogRef, triggerRef);

  useEffect(() => {
    if (!overlayOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [overlayOpen, closeOverlay]);

  return (
    <AnimatePresence>
      {overlayOpen ? (
        <motion.div
          ref={dialogRef}
          className="overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-index-title"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: reduced ? 0.1 : 0.34, ease }}
        >
          <div className="overlay__top">
            <p id="project-index-title" className="label">
              {t("nav.projectIndex")}
            </p>
            <button
              type="button"
              className="icon-btn"
              aria-label={t("nav.closeIndex")}
              onClick={closeOverlay}
            >
              <X size={22} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
          <ul className="overlay__list">
            {projects.map((project, index) => (
              <motion.li
                key={project.id}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduced ? 0.1 : 0.36,
                  delay: reduced ? 0 : 0.04 + index * 0.045,
                  ease,
                }}
              >
                <Link
                  className="overlay-row"
                  to={project.route}
                  onClick={closeOverlay}
                >
                  <span className="overlay-row__num">{project.number}</span>
                  <span>
                    <h2>{project.title[locale]}</h2>
                    <p>
                      {project.type[locale]}
                      {project.year ? ` · ${project.year}` : ""}
                    </p>
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
