import { describe, expect, it } from "vitest";
import content from "../content/project-content.json";
import {
  featuredProjects,
  moreWorkProjects,
  projects,
  site,
} from "../content/projects";

describe("content contract", () => {
  it("has exactly four projects with Student and IR featured", () => {
    expect(projects).toHaveLength(4);
    expect(featuredProjects.map((p) => p.id)).toEqual([
      "student-risk",
      "restaurant-search",
    ]);
    expect(moreWorkProjects.map((p) => p.id)).toEqual([
      "face-attendance",
      "flight-booking",
    ]);
  });

  it("gives each case study exactly three chapters", () => {
    for (const project of projects) {
      expect(project.chapters).toHaveLength(3);
      expect(project.route.startsWith("/work/")).toBe(true);
    }
  });

  it("uses AP 0.806 at OULAD 35% as the Student headline", () => {
    const student = projects.find((p) => p.id === "student-risk");
    expect(student?.headlineMetrics?.[0]).toMatchObject({
      label: "AP",
      value: 0.806,
      qualifier: "OULAD @35%",
    });
    const evidence = student?.evidence as {
      ouladAveragePrecision: { cutoffsPercent: number[]; values: number[] };
    };
    const idx = evidence.ouladAveragePrecision.cutoffsPercent.indexOf(35);
    expect(evidence.ouladAveragePrecision.values[idx]).toBe(0.806);
    const full = evidence.ouladAveragePrecision.cutoffsPercent.indexOf(100);
    expect(evidence.ouladAveragePrecision.values[full]).toBe(0.92);
  });

  it("does not invent IR retrieval metrics", () => {
    const ir = content.projects.find((p) => p.id === "restaurant-search");
    const published = JSON.stringify({
      headline: ir?.headlineMetrics,
      evidence: ir?.evidence,
      chapters: ir?.chapters,
    });
    expect(published).not.toMatch(/retrieval lift/i);
    expect(ir?.headlineMetrics?.[0]?.qualifier).toContain(
      "LinearSVC sentiment",
    );
    expect(ir?.headlineMetrics?.[0]?.label).toBe("Accuracy");
  });

  it("spells ArcFace and states liveness is disabled", () => {
    const face = projects.find((p) => p.id === "face-attendance");
    expect(face?.stack.join(" ")).toContain("ArcFace");
    expect(face?.stack.join(" ")).not.toContain("ArFace");
    expect(face?.requiredCaveats.en[0]).toMatch(/liveness/i);
    expect(face?.sourceStatus).toBe("enabled");
    expect(face?.repository).toBe("Face_detect");
  });

  it("states Flight team size, contribution, and simulated payment", () => {
    const flight = projects.find((p) => p.id === "flight-booking");
    expect(flight?.teamSize).toBe(4);
    expect(flight?.role?.en).toMatch(/full-stack/i);
    expect(flight?.requiredCaveats.en.join(" ")).toMatch(/simulated/i);
    expect(flight?.sourceStatus).toBe("enabled");
    expect(flight?.repository).toBe("web_maybay");
  });

  it("keeps contact limited to verified channels", () => {
    expect(site.contact.email).toBe("tranhoangphuc05092005@gmail.com");
    expect(site.contact.github).toBe("https://github.com/Phucht59");
    expect(site.contact.linkedin).toBeNull();
  });

  it("publishes the four owner GitHub repositories", () => {
    expect(projects.map((p) => p.repository)).toEqual([
      "prediction_student",
      "IR_Course_Project",
      "Face_detect",
      "web_maybay",
    ]);
    expect(projects.every((p) => p.sourceStatus === "enabled")).toBe(true);
  });
});
