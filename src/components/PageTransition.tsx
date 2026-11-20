import { AnimatePresence, motion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: -6,
          transition: { duration: reduced ? 0.08 : 0.22, ease },
        }}
        transition={{
          duration: reduced ? 0.08 : 0.36,
          ease,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
