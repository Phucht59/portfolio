import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { RibbonErrorFallback } from "../scene/RibbonErrorFallback";
import { useScenePreferences } from "../scene/ScenePreferences";
import { useSceneLayout } from "../scene/useSceneLayout";

const WorldCanvas = lazy(() => import("./WorldCanvas"));

export function FullHomepageScene() {
  const preferences = useScenePreferences();
  const layout = useSceneLayout();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback((error: Error) => {
    console.warn("[PHUC world] Semantic fallback:", error.message);
    setFailed(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.homeWorld = failed ? "fallback" : "active";
    return () => {
      delete document.documentElement.dataset.homeWorld;
    };
  }, [failed]);

  useEffect(() => {
    document.documentElement.dataset.worldTheme = preferences.night ? "moonlight" : "day";
    return () => {
      delete document.documentElement.dataset.worldTheme;
    };
  }, [preferences.night]);

  useEffect(() => {
    document.documentElement.dataset.scene = ready && !failed ? "webgl" : "fallback";
    return () => {
      delete document.documentElement.dataset.scene;
    };
  }, [ready, failed]);

  return (
    <>
      <div className="full-world-atmosphere" aria-hidden="true" />
      <div className="full-world-reading-wash" aria-hidden="true" />
      <div
        className="portfolio-scene full-world-scene"
        aria-hidden="true"
        data-renderer={failed ? "fallback" : ready ? "webgl" : "loading"}
      >
        {!failed && layout && (
          <RibbonErrorFallback onFail={onFail}>
            <Suspense fallback={null}>
              <WorldCanvas layout={layout} onFail={onFail} onReady={onReady} {...preferences} />
            </Suspense>
          </RibbonErrorFallback>
        )}
      </div>
    </>
  );
}
