import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import type { StageLayout } from "./shape";
export type TileAnchor = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone: string;
  kind: string;
  label: string;
  svg: string | null;
  image: string | null;
  el: HTMLElement;
  order: number;
};
export type SceneLayout = StageLayout & {
  nodes: TileAnchor[];
};
export function useSceneLayout() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [layout, setLayout] = useState<SceneLayout | null>(null);
  useEffect(() => {
    let disposed = false,
      frame = 0;
    const observed = new WeakSet<Element>();
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const resize = new ResizeObserver(schedule);
    function measure() {
      if (disposed) return;
      const stage =
        document.querySelector<HTMLElement>(
          ".node-stage-wrap.is-on .node-stage",
        ) ?? document.querySelector<HTMLElement>(".node-stage");
      if (!stage) return;
      if (!observed.has(stage)) {
        resize.observe(stage);
        observed.add(stage);
      }
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const round = (n: number) => Math.round(n * 2) / 2;
      const nodes = Array.from(
        stage.querySelectorAll<HTMLElement>(".node-tile,.brand-chip"),
      ).map((el, i) => {
        const r = el.getBoundingClientRect(),
          svg = el.querySelector("svg"),
          brand = el.classList.contains("brand-chip");
        const tone = el.classList.contains("node-tile--risk")
          ? "risk"
          : el.classList.contains("node-tile--hybrid")
            ? "hybrid"
            : el.classList.contains("node-tile--support")
              ? "support"
              : brand
                ? "plain"
                : "data";
        return {
          id: `slot-${i}`,
          x: round(r.left + window.scrollX),
          y: round(r.top + window.scrollY),
          width: round(r.width),
          height: round(r.height),
          tone,
          kind: brand ? "brand" : "node",
          label:
            el.dataset.label || el.querySelector("span")?.textContent || "",
          svg: svg
            ? new XMLSerializer()
                .serializeToString(svg)
                .replaceAll("currentColor", getComputedStyle(el).color)
            : null,
          image: el.querySelector("img")?.src || null,
          el,
          order: i,
        };
      });
      const next: SceneLayout = {
        x: round(rect.left),
        y: round(rect.top + window.scrollY),
        width: round(rect.width),
        height: round(rect.height),
        viewportWidth: window.innerWidth,
        pageHeight: document.documentElement.scrollHeight,
        mobile: window.innerWidth < 760,
        home: location.pathname === "/",
        nodes,
      };
      setLayout((previous) =>
        previous &&
        previous.x === next.x &&
        previous.y === next.y &&
        previous.width === next.width &&
        previous.height === next.height &&
        previous.pageHeight === next.pageHeight &&
        previous.viewportWidth === next.viewportWidth &&
        previous.mobile === next.mobile &&
        previous.home === next.home &&
        previous.nodes.length === nodes.length &&
        nodes.every((n, i) => {
          const p = previous.nodes[i];
          return (
            p.el === n.el &&
            p.x === n.x &&
            p.y === n.y &&
            p.width === n.width &&
            p.height === n.height &&
            p.label === n.label &&
            p.svg === n.svg &&
            p.image === n.image &&
            p.tone === n.tone
          );
        })
          ? previous
          : next,
      );
    }
    resize.observe(document.body);
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.querySelector(".site-main") || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-project", "aria-hidden"],
    });
    window.addEventListener("resize", schedule);
    void document.fonts.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [location.pathname, i18n.language]);
  return layout;
}
