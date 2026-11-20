import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
const Context = createContext({
  reduced: false,
  paused: false,
  hidden: false,
  night: false,
  toggleTheme: () => {},
  toggle: () => {},
});
export function ScenePreferences({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false),
    [hidden, setHidden] = useState(false);
  const [night, setNight] = useState(false);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", change);
    change();
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  return (
    <Context.Provider
      value={{ reduced, paused, hidden, night, toggleTheme: () => setNight(v => !v), toggle: () => setPaused((v) => !v) }}
    >
      {children}
    </Context.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useScenePreferences() {
  return useContext(Context);
}
