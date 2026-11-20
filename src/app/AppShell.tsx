import { Outlet, useLocation } from "react-router";
import { FullHomepageScene } from "../components/full-world/FullHomepageScene";
import { ScenePreferences } from "../components/scene/ScenePreferences";
import { Header } from "../components/Header";
import { ProjectIndexOverlay } from "../components/ProjectIndexOverlay";
import { SkipLink } from "../components/SkipLink";
import { UiProvider } from "./UiContext";
import { PageTransition } from "../components/PageTransition";

export function AppShell() {
  const home = useLocation().pathname === "/";
  return (
    <UiProvider>
      <ScenePreferences>
        <div className="app-shell">
          <SkipLink />
          {home ? <FullHomepageScene /> : null}
          <Header />
          <ProjectIndexOverlay />
          <div className="site-main">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </div>
      </ScenePreferences>
    </UiProvider>
  );
}
