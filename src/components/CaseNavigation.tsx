import { ArrowLeft, ArrowRight, Github } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  getAdjacentProjects,
  githubRepoUrl,
  isSourceEnabled,
} from "../content/projects";
import type { Locale, Project } from "../content/types";

export function CaseNavigation({ project }: { project: Project }) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;
  const { previous, next } = getAdjacentProjects(project.id);
  const enabled = isSourceEnabled(project.sourceStatus);
  const sourceLabel =
    project.sourceStatus === "blocked-security-cleanup"
      ? t("case.sourcePending")
      : t("case.sourceReview");

  return (
    <nav className="case-nav" aria-label="Case study">
      {previous ? (
        <Link className="text-link" to={previous.route}>
          <ArrowLeft aria-hidden="true" />
          <span>
            <span className="label">{t("case.previous")}</span>
            <br />
            {previous.title[locale]}
          </span>
        </Link>
      ) : (
        <Link className="text-link" to="/#work">
          <ArrowLeft aria-hidden="true" />
          {t("case.backToWork")}
        </Link>
      )}

      {enabled ? (
        <a
          className="text-link case-nav__source"
          href={githubRepoUrl(project.repository)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github aria-hidden="true" />
          {t("case.source")}
        </a>
      ) : (
        <button
          type="button"
          className="source-disabled case-nav__source"
          disabled
          title={sourceLabel}
        >
          <Github aria-hidden="true" />
          {sourceLabel}
        </button>
      )}

      {next ? (
        <Link className="text-link case-nav__next" to={next.route}>
          <span>
            <span className="label">{t("case.next")}</span>
            <br />
            {next.title[locale]}
          </span>
          <ArrowRight aria-hidden="true" />
        </Link>
      ) : (
        <Link className="text-link case-nav__next" to="/#work">
          {t("case.backToWork")}
          <ArrowRight aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
