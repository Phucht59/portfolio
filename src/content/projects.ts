import raw from "./project-content.json";
import type {
  Locale,
  Project,
  ProjectId,
  SiteContent,
  SourceStatus,
  StudentEvidence,
} from "./types";

const content = raw as {
  site: SiteContent;
  projects: Project[];
};

export const site: SiteContent = content.site;

export const projects: Project[] = content.projects;

export const featuredProjects = projects.filter((project) => project.featured);

export const moreWorkProjects = projects.filter((project) => !project.featured);

export const CONTACT_EMAIL = site.contact.email;
export const GITHUB_PROFILE = site.contact.github;
export const CV_ENABLED = true;

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectByRoute(pathname: string): Project | undefined {
  return projects.find((project) => project.route === pathname);
}

export function getAdjacentProjects(id: ProjectId): {
  previous: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((project) => project.id === id);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: projects[index - 1] ?? null,
    next: projects[index + 1] ?? null,
  };
}

export function isSourceEnabled(status: SourceStatus): boolean {
  return status === "enabled";
}

export function githubRepoUrl(repository: string): string {
  return `https://github.com/Phucht59/${repository}`;
}

export function localize<T extends { en: string; vi: string }>(
  value: T,
  locale: Locale,
): string {
  return value[locale];
}

export function formatMetricValue(value: number, display?: string): string {
  if (display) return display;
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

export function isStudentEvidence(
  evidence: Project["evidence"],
): evidence is StudentEvidence {
  return Boolean(
    evidence &&
      "uciAveragePrecision" in evidence &&
      "ouladAveragePrecision" in evidence,
  );
}

export const PROJECT_IDS: ProjectId[] = [
  "student-risk",
  "restaurant-search",
  "face-attendance",
  "flight-booking",
];
