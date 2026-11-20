import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function DocumentMeta() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language.startsWith("vi") ? "vi" : "en";
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", t("meta.description"));
  }, [i18n.language, t]);

  return null;
}
