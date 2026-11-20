import type { LucideIcon } from "lucide-react";
type Props = {
  icon: LucideIcon;
  label: string;
  variant?: "default" | "hybrid" | "risk" | "support";
  index?: number;
  hint?: string;
};
export function NodeTile({
  icon: Icon,
  label,
  variant = "default",
  index = 0,
}: Props) {
  return (
    <div
      className={
        "node-tile" + (variant === "default" ? "" : " node-tile--" + variant)
      }
      data-node-index={index}
      data-label={label}
      aria-hidden="true"
    >
      <Icon size={30} strokeWidth={1.3} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
