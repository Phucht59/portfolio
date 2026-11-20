import { useEffect } from "react";
import { useLocation } from "react-router";
import { Hero } from "../components/Hero";
import { FeaturedProjectCarousel } from "../components/FeaturedProjectCarousel";
import { MoreWorkList } from "../components/MoreWorkList";
import { About } from "../components/About";
import { ContactFooter } from "../components/ContactFooter";
import { LocaleFade } from "../components/LocaleFade";
import { SelectedWork, Resume, ChapterRail } from "../components/PortfolioChapters";
export default function HomePage() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1),
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      frame = requestAnimationFrame(() =>
        document
          .getElementById(id)
          ?.scrollIntoView({
            behavior: reduce ? "instant" : "smooth",
            block: "start",
          }),
      );
    return () => cancelAnimationFrame(frame);
  }, [location.hash]);
  return (
    <LocaleFade>
      <main id="main" className="page">
        <div className="container">
          <ChapterRail />
          <Hero />
          <About />
          <div id="threshold" className="world-threshold" aria-hidden="true" />
          <SelectedWork />
          <FeaturedProjectCarousel />
          <MoreWorkList />
          <Resume />
          <ContactFooter />
        </div>
      </main>
    </LocaleFade>
  );
}
