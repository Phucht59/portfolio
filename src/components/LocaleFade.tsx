import type { ReactNode } from "react";

export function LocaleFade({ children }: { children: ReactNode }) {
  return <div className="locale-root">{children}</div>;
}
