import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  enabled: boolean,
  containerRef: RefObject<HTMLElement | null>,
  restoreRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!enabled) return;
    const node = containerRef.current;
    if (!node) return;

    const previouslyFocused =
      restoreRef.current ?? (document.activeElement as HTMLElement | null);
    const items = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) =>
          !el.hasAttribute("disabled") &&
          el.getAttribute("aria-hidden") !== "true",
      );

    const first = items()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const list = items();
      if (list.length === 0) {
        event.preventDefault();
        return;
      }
      const currentIndex = list.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey) {
        if (currentIndex <= 0) {
          event.preventDefault();
          list[list.length - 1]?.focus();
        }
      } else if (currentIndex === list.length - 1) {
        event.preventDefault();
        list[0]?.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [enabled, containerRef, restoreRef]);
}
