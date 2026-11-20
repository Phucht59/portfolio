export type Locale = "en" | "vi";

export type LocaleText = {
  en: string;
  vi: string;
};

export type HeadlineMetric = {
  label: string;
  value: number;
  qualifier?: string;
  display?: string;
};

export type Chapter = {
  number: string;
  title: LocaleText;
  body: LocaleText;
};

export type SourceStatus =
  | "enabled"
  | "owner-review-required"
  | "blocked-security-cleanup";

export type StudentEvidence = {
  uciAveragePrecision: {
    stages: string[];
    values: number[];
  };
  ouladAveragePrecision: {
    cutoffsPercent: number[];
    values: number[];
  };
  recommendation: {
    precisionAt1: number;
    ndcgAt3: number;
    heldOutCases: number;
    invalidActions: number;
    usesFullCourseCutoff: boolean;
  };
};

export type RestaurantEvidence = {
  retrievalPipeline: string[];
  sentiment: {
    model: string;
    classes: number;
    approximateAccuracy: number;
    labelSource: string;
  };
  aspects: string[];
  dashboard: string;
};

export type ProjectId =
  | "student-risk"
  | "restaurant-search"
  | "face-attendance"
  | "flight-booking";

export type Project = {
  id: ProjectId;
  number: string;
  route: string;
  repository: string;
  sourceStatus: SourceStatus;
  featured: boolean;
  type: LocaleText;
  year?: string;
  title: LocaleText;
  summary: LocaleText;
  headlineMetrics?: HeadlineMetric[];
  stack: string[];
  chapters: Chapter[];
  requiredCaveats: {
    en: string[];
    vi: string[];
  };
  evidence?: StudentEvidence | RestaurantEvidence;
  workflow?: string[];
  attribution?: string;
  role?: LocaleText;
  implementedScope?: string[];
  teamSize?: number;
};

export type SiteContent = {
  name: string;
  role: LocaleText;
  location: LocaleText;
  availability: LocaleText;
  intro: LocaleText;
  about: LocaleText;
  contact: {
    email: string;
    github: string;
    linkedin: string | null;
  };
};
