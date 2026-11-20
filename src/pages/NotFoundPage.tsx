import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { projects } from "../content/projects";
import { ContactFooter } from "../components/ContactFooter";
import { LocaleFade } from "../components/LocaleFade";
import type { Locale } from "../content/types";

export default function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;

  return (
    <LocaleFade>
      <main id="main" className="page">
        <div className="container not-found">
          <p className="label">404</p>
          <h1>{t("notFound.title")}</h1>
          <p className="muted">{t("notFound.body")}</p>
          <ul className="not-found__links">
            <li>
              <Link className="text-link" to="/">
                {t("notFound.home")}
              </Link>
            </li>
            {projects.map((project) => (
              <li key={project.id}>
                <Link className="text-link" to={project.route}>
                  {project.number} · {project.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="container">
          <ContactFooter headline={false} />
        </div>
      </main>
    </LocaleFade>
  );
}
