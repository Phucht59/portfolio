import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { moreWorkProjects } from "../content/projects";
import { Reveal } from "./Reveal";
import type { Locale } from "../content/types";

export function MoreWorkList() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;

  return (
    <section id="more-work" className="more-work" aria-labelledby="more-work-heading">
      <h2 id="more-work-heading" className="label">
        {t("home.moreWork")}
      </h2>
      <ul className="more-work__list">
        {moreWorkProjects.map((project, index) => (
          <li key={project.id}>
            <Reveal delay={index * 0.04}>
              <Link className="work-row" to={project.route}>
                <span className="work-row__num">{project.number}</span>
                <span>
                  <span className="work-row__title">
                    {project.title[locale]}
                  </span>
                  <p className="work-row__stack">{project.stack.join(" · ")}</p>
                  {project.teamSize ? (
                    <span className="pill">
                      {t("home.teamProject")} ·{" "}
                      {t("home.members", { count: project.teamSize })}
                    </span>
                  ) : null}
                  <p className="work-row__note">{project.summary[locale]}</p>
                </span>
                <span className="work-row__arrow" aria-hidden="true">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
