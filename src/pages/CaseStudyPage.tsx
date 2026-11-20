import { Navigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { getProject, isStudentEvidence } from "../content/projects";
import type {
  Locale,
  Project,
  RestaurantEvidence,
  StudentEvidence,
} from "../content/types";
import { CaseHero } from "../components/CaseHero";
import { ChapterSection } from "../components/ChapterSection";
import { CaseNavigation } from "../components/CaseNavigation";
import { ContactFooter } from "../components/ContactFooter";
import { LocaleFade } from "../components/LocaleFade";
import { MetricChart } from "../components/MetricChart";
import { StudentArchitecture } from "../components/diagrams/StudentArchitecture";
import { RestaurantPipeline } from "../components/diagrams/RestaurantPipeline";
import { FaceWorkflow } from "../components/diagrams/FaceWorkflow";
import { FlightJourney } from "../components/diagrams/FlightJourney";
import { Reveal } from "../components/Reveal";

const FLIGHT_JOURNEY = [
  "Search",
  "Flight selection",
  "Seat holding",
  "Passenger information",
  "Checkout validation",
  "Simulated payment",
  "E-ticket",
];

function publicCaveats(items: string[]): string[] {
  return items
    .filter(
      (item) => !/^Do not show/i.test(item) && !/^Không hiển thị/i.test(item),
    )
    .map((item) => {
      if (/^Do not publish/i.test(item)) {
        return "No numeric retrieval lift, MAP, nDCG, or dataset count is published.";
      }
      if (/^Không công bố/i.test(item)) {
        return "Không công bố retrieval lift, MAP, nDCG hoặc quy mô dữ liệu.";
      }
      return item;
    });
}

const FACE_OPS = [
  "Employee management",
  "Face enrolment",
  "Shift assignment",
  "Lateness handling",
  "Attendance history",
];

export default function CaseStudyPage() {
  const { projectId } = useParams();
  const project = projectId ? getProject(projectId) : undefined;
  if (!project) return <Navigate to="/404" replace />;
  return <CaseStudy project={project} />;
}

function CaseStudy({ project }: { project: Project }) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language.startsWith("vi") ? "vi" : "en") as Locale;

  return (
    <LocaleFade>
      <main id="main" className="page">
        <article className="container">
          <CaseHero project={project} />

          <ChapterSection project={project} index={0} locale={locale}>
            {project.id === "student-risk" ? <StudentData /> : null}
            {project.id === "face-attendance" ? (
              <FaceWorkflow steps={project.workflow ?? []} />
            ) : null}
            {project.id === "flight-booking" ? (
              <FlightJourney steps={FLIGHT_JOURNEY} />
            ) : null}
            {project.id === "restaurant-search" ? (
              <p className="muted">{t("case.yelpAttribution")}</p>
            ) : null}
          </ChapterSection>

          <ChapterSection project={project} index={1} locale={locale}>
            {project.id === "student-risk" ? <StudentArchitecture /> : null}
            {project.id === "restaurant-search" ? <RestaurantPipeline /> : null}
            {project.id === "face-attendance" ? (
              <div className="surface">
                <p>{FACE_OPS.join(" · ")}</p>
              </div>
            ) : null}
            {project.id === "flight-booking" ? (
              <div className="surface arch-grid">
                <div className="arch-col">
                  <h3>Client</h3>
                  <p>React 19</p>
                  <p>Vite 8</p>
                  <p>React Router</p>
                </div>
                <div className="arch-col">
                  <h3>API</h3>
                  <p>ASP.NET Core</p>
                  <p>.NET 8</p>
                  <p>JWT</p>
                </div>
                <div className="arch-col">
                  <h3>Data</h3>
                  <p>Entity Framework Core</p>
                  <p>SQLite</p>
                </div>
              </div>
            ) : null}
          </ChapterSection>

          <ChapterSection project={project} index={2} locale={locale}>
            {project.id === "student-risk" &&
            isStudentEvidence(project.evidence) ? (
              <StudentEvidenceBlock evidence={project.evidence} />
            ) : null}
            {project.id === "restaurant-search" &&
            project.evidence &&
            "sentiment" in project.evidence ? (
              <RestaurantEvidenceBlock evidence={project.evidence} />
            ) : null}
            {project.id === "face-attendance" ? (
              <p className="banner banner--warn" role="note">
                {t("case.livenessBanner")}
              </p>
            ) : null}
            {project.id === "flight-booking" ? (
              <>
                {project.implementedScope ? (
                  <p className="muted">
                    {project.implementedScope.join(" · ")}
                  </p>
                ) : null}
                <p
                  className="banner banner--neutral"
                  role="note"
                  style={{ marginTop: 16 }}
                >
                  {t("case.paymentBanner")}
                </p>
              </>
            ) : null}
          </ChapterSection>

          <Reveal className="caveats">
            <h2 className="label">{t("case.limitations")}</h2>
            <ul>
              {publicCaveats(project.requiredCaveats[locale]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {project.attribution ? (
              <p className="muted" style={{ marginTop: 12 }}>
                {t("case.attribution")}: {project.attribution}
              </p>
            ) : null}
          </Reveal>

          <CaseNavigation project={project} />
        </article>
        <div className="container">
          <ContactFooter headline={false} />
        </div>
      </main>
    </LocaleFade>
  );
}

function StudentData() {
  const { t } = useTranslation();
  return (
    <div className="split-facts cols-3">
      <div>
        <h3>UCI</h3>
        <p>1,044 records</p>
        <p>662 student groups</p>
        <p>S0–S2</p>
      </div>
      <div>
        <h3>OULAD</h3>
        <p>32,593 enrolments</p>
        <p>28,785 students</p>
        <p>10M+ VLE events</p>
      </div>
      <div>
        <h3>{t("case.distinctDatasets")}</h3>
      </div>
    </div>
  );
}

function StudentEvidenceBlock({ evidence }: { evidence: StudentEvidence }) {
  const { t } = useTranslation();
  const rec = evidence.recommendation;
  return (
    <div className="surface surface--diagram chart-block two">
      <div>
        <MetricChart
          title="UCI Average Precision"
          labels={evidence.uciAveragePrecision.stages}
          values={evidence.uciAveragePrecision.values}
          summary="UCI average precision at stages S0, S1 and S2: 0.455, 0.821 and 0.910."
        />
        <MetricChart
          title="OULAD Average Precision"
          labels={evidence.ouladAveragePrecision.cutoffsPercent.map(
            (n) => `${n}%`,
          )}
          values={evidence.ouladAveragePrecision.values}
          highlightIndex={1}
          summary="OULAD average precision at 20, 35, 50, 75 and 100 percent cutoffs. The 35 percent cutoff is 0.806."
        />
      </div>
      <div className="rec-grid">
        <div className="rec-item">
          <strong>P@1 {rec.precisionAt1.toFixed(3)}</strong>
          <span>Precision at 1</span>
        </div>
        <div className="rec-item">
          <strong>NDCG@3 {rec.ndcgAt3.toFixed(3)}</strong>
          <span>{t("case.supportRanking")}</span>
        </div>
        <div className="rec-item">
          <strong>{rec.heldOutCases}</strong>
          <span>{t("case.heldOut")}</span>
        </div>
        <div className="rec-item">
          <strong>{rec.invalidActions}</strong>
          <span>{t("case.invalidActions")}</span>
        </div>
      </div>
    </div>
  );
}

function RestaurantEvidenceBlock({
  evidence,
}: {
  evidence: RestaurantEvidence;
}) {
  return (
    <div className="surface split-facts">
      <div>
        <h3>LinearSVC</h3>
        <p>
          ≈{(evidence.sentiment.approximateAccuracy * 100).toFixed(0)}% accuracy
        </p>
        <p>{evidence.sentiment.classes}-class sentiment</p>
        <p>Labels from {evidence.sentiment.labelSource}</p>
      </div>
      <div>
        <h3>Aspects</h3>
        <p>{evidence.aspects.join(" · ")}</p>
        <p>Dashboard: {evidence.dashboard}</p>
      </div>
    </div>
  );
}
