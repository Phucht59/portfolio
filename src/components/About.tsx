import { useTranslation } from "react-i18next";
import { site } from "../content/projects";
import { Reveal } from "./Reveal";
import type { Locale } from "../content/types";

export function About() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;

  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      <Reveal>
        <h2 id="about-heading" className="label">
          {t("home.about")}
        </h2>
        <h3 className="about-statement">{locale === "vi" ? "Biến dữ liệu thành tác động thực." : "Turning data into real impact."}</h3>
        <div className="about__grid">
          <p className="about__body">{site.about[locale]}</p>
          <div>
            <div className="about__timeline">
              <div>
                <p className="label">{t("home.education")}</p>
                <p className="muted">{t("home.educationMeta")}</p>
              </div>
            </div>
            <p className="about__skills">{t("home.skills")}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
