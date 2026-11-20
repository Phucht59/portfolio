import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type UiContextValue = {
  overlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openOverlay = useCallback(() => setOverlayOpen(true), []);
  const closeOverlay = useCallback(() => setOverlayOpen(false), []);

  const value = useMemo(
    () => ({ overlayOpen, openOverlay, closeOverlay, triggerRef }),
    [overlayOpen, openOverlay, closeOverlay],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

// Shared provider hook intentionally lives beside its context owner.
// eslint-disable-next-line react-refresh/only-export-components
export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
