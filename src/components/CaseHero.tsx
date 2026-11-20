import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { formatMetricValue } from "../content/projects";
import { StackPills } from "./BrandMark";
import { StudentNodes } from "./diagrams/StudentNodes";
import { RestaurantNodes } from "./diagrams/RestaurantNodes";
import { FaceNodes } from "./diagrams/FaceNodes";
import { FlightNodes } from "./diagrams/FlightNodes";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { Locale, Project } from "../content/types";

const ease = [0.22, 1, 0.36, 1] as const;

function HeroVisual({ id }: { id: string }) {
  if (id === "student-risk") return <StudentNodes />;
  if (id === "restaurant-search") return <RestaurantNodes />;
  if (id === "face-attendance") return <FaceNodes />;
  if (id === "flight-booking") return <FlightNodes />;
  return null;
}

export function CaseHero({ project }: { project: Project }) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;
  const reduced = usePrefersReducedMotion();
  const d = (i: number) => (reduced ? 0 : i * 0.05);

  const fade = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.1 : 0.48, delay: d(i), ease },
  });

  return (
    <header className="case-hero">
      <div>
        <motion.p className="label case-kicker" {...fade(0)}>
          {t("case.kicker")}
        </motion.p>
        <motion.h1 {...fade(1)}>{project.title[locale]}</motion.h1>
        <motion.p className="case-hero__summary" {...fade(2)}>
          {project.summary[locale]}
        </motion.p>
        <motion.p className="case-meta" {...fade(3)}>
          <span>{project.type[locale]}</span>
          {project.year ? <span>{project.year}</span> : null}
        </motion.p>
        {project.role ? (
          <motion.p className="case-hero__summary" {...fade(4)}>
            <strong>
              {locale === "vi" ? "Đóng góp cá nhân: " : "My contribution: "}
            </strong>
            {project.role[locale]}
          </motion.p>
        ) : null}
        {project.headlineMetrics ? (
          <motion.dl className="case-metrics" {...fade(5)}>
            {project.headlineMetrics.map((metric) => (
              <div className="metric" key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>
                  {formatMetricValue(metric.value, metric.display)}
                  {metric.qualifier ? (
                    <span className="metric__qual">{metric.qualifier}</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </motion.dl>
        ) : null}
        <motion.div {...fade(6)}>
          <StackPills items={project.stack} />
        </motion.div>
      </div>
      <motion.div className="featured-visual-frame" {...fade(2)}>
        <div className="node-stage-wrap is-on">
          <HeroVisual id={project.id} />
        </div>
      </motion.div>
    </header>
  );
}
