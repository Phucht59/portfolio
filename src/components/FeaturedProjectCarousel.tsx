import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { featuredProjects, formatMetricValue } from "../content/projects";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { StudentNodes } from "./diagrams/StudentNodes";
import { RestaurantNodes } from "./diagrams/RestaurantNodes";
import type { Locale } from "../content/types";

const ease = [0.22, 1, 0.36, 1] as const;
const copyVariants = {
  initial: (direction: number) => ({ opacity: 0, y: 16 * direction }),
  animate: { opacity: 1, y: 0 },
  exit: (direction: number) => ({ opacity: 0, y: -12 * direction }),
};

export function FeaturedProjectCarousel() {
  const { t, i18n } = useTranslation(),
    reduced = usePrefersReducedMotion();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;
  const [index, setIndex] = useState(0),
    [direction, setDirection] = useState(1),
    start = useRef<{
      x: number;
      y: number;
    } | null>(null),
    swiped = useRef(false);
  const project = featuredProjects[index],
    other = featuredProjects[index === 0 ? 1 : 0];
  const select = (next: number) => {
    const clamped = Math.max(0, Math.min(featuredProjects.length - 1, next));
    if (clamped === index) return;
    setDirection(clamped > index ? 1 : -1);
    setIndex(clamped);
  };
  return (
    <section
      id="featured"
      className="featured"
      aria-labelledby="featured-heading"
      data-project={project.id}
    >
      <div className="featured-chrome">
        <h2 id="featured-heading" className="label">
          {t("home.featuredWork")}
        </h2>
        <div className="featured-progress">
          <span className="featured-progress__index">0{index + 1} / 02</span>
          <div className="featured-progress__track" aria-hidden="true">
            <motion.div
              className="featured-progress__bar"
              animate={{ width: (index + 1) * 50 + "%" }}
              transition={{ duration: reduced ? 0 : 0.45, ease }}
            />
          </div>
          <div className="featured-arrows">
            <button
              type="button"
              className="icon-btn"
              disabled={index === 0}
              aria-label={t("home.carouselPrev")}
              onClick={() => select(index - 1)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="icon-btn"
              disabled={index === 1}
              aria-label={t("home.carouselNext")}
              onClick={() => select(index + 1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div
        className="featured-layout"
        aria-roledescription="carousel"
        aria-label={t("home.carouselLabel")}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            select(index + (e.key === "ArrowRight" ? 1 : -1));
          }
        }}
        onTouchStart={(e) => {
          start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          swiped.current = false;
        }}
        onTouchEnd={(e) => {
          if (!start.current) return;
          const dx = e.changedTouches[0].clientX - start.current.x,
            dy = e.changedTouches[0].clientY - start.current.y;
          if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            swiped.current = true;
            select(index + (dx < 0 ? 1 : -1));
          }
          start.current = null;
        }}
        onClickCapture={(e) => {
          if (swiped.current) {
            e.preventDefault();
            e.stopPropagation();
            swiped.current = false;
          }
        }}
      >
        <div className="featured-frame">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={project.id}
              className="featured-copy"
              custom={direction}
              variants={copyVariants}
              initial={reduced ? false : "initial"}
              animate="animate"
              exit={reduced ? { opacity: 0 } : "exit"}
              transition={{ duration: reduced ? 0 : 0.48, ease }}
            >
              <div className="featured-index" aria-hidden="true">
                {project.number}
              </div>
              <h3 className="featured-title">{project.title[locale]}</h3>
              <p className="featured-type">
                {project.type[locale]}
                {project.year ? " · " + project.year : ""}
              </p>
              <p className="featured-summary">{project.summary[locale]}</p>
              {project.headlineMetrics ? (
                <dl className="featured-metrics">
                  {project.headlineMetrics.map((m) => (
                    <div className="metric" key={m.label}>
                      <dt>{m.label}</dt>
                      <dd>
                        {formatMetricValue(m.value, m.display)}
                        {m.qualifier ? (
                          <span className="metric__qual">{m.qualifier}</span>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <p className="featured-stack">{project.stack.join(" · ")}</p>
              <Link className="text-link" to={project.route}>
                {t("home.viewCaseStudy")}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="featured-visual-frame">
          <div
            className={
              index === 0 ? "node-stage-wrap is-on" : "node-stage-wrap"
            }
            aria-hidden={index !== 0}
          >
            <StudentNodes />
          </div>
          <div
            className={
              index === 1 ? "node-stage-wrap is-on" : "node-stage-wrap"
            }
            aria-hidden={index !== 1}
          >
            <RestaurantNodes />
          </div>
        </div>
        <button
          type="button"
          className="featured-peek"
          onClick={() => select(index === 0 ? 1 : 0)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={other.number}
              className="featured-peek__num"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduced ? 0 : 0.32, ease }}
            >
              {other.number}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={other.id}
              className="featured-peek__title"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduced ? 0 : 0.32, ease }}
            >
              {other.title[locale]}
            </motion.span>
          </AnimatePresence>
          {index === 0 ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {t("home.slideStatus", {
          current: index + 1,
          total: 2,
          title: project.title[locale],
        })}
      </p>
    </section>
  );
}
