import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import { AppShell } from "./AppShell";
import { DocumentMeta } from "../components/DocumentMeta";

const HomePage = lazy(() => import("../pages/HomePage"));
const CaseStudyPage = lazy(() => import("../pages/CaseStudyPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export default function App() {
  return (
    <BrowserRouter>
      <DocumentMeta />
      <Suspense
        fallback={<div className="container" style={{ padding: 48 }} />}
      >
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/work/:projectId" element={<CaseStudyPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
