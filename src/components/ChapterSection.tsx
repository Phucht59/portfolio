import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { Locale, Project } from "../content/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function ChapterSection({
  project,
  index,
  locale,
  children,
}: {
  project: Project;
  index: number;
  locale: Locale;
  children?: ReactNode;
}) {
  const chapter = project.chapters[index];
  const reduced = usePrefersReducedMotion();
  if (!chapter) return null;
  const total = project.chapters.length;
  const d = (i: number) => (reduced ? 0 : i * 0.05);

  return (
    <section className="chapter">
      <div className="chapter-indicator" aria-hidden="true">
        <span>
          {chapter.number} / {String(total).padStart(2, "0")}
        </span>
        <span>{chapter.title[locale]}</span>
        <span className="chapter-indicator__track">
          <span style={{ width: `${((index + 1) / total) * 100}%` }} />
        </span>
      </div>
      <Reveal>
        <motion.div
          className="chapter__head"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.48, delay: d(0), ease }}
        >
          <p className="chapter__num">{chapter.number}</p>
          <h2 className="chapter__title">{chapter.title[locale]}</h2>
        </motion.div>
        <motion.p
          className="chapter__body"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.48, delay: d(1), ease }}
        >
          {chapter.body[locale]}
        </motion.p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.44, delay: d(2), ease }}
        >
          {children}
        </motion.div>
      </Reveal>
    </section>
  );
}
