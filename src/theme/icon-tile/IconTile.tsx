import type { LucideIcon } from "lucide-react";
import cn from "../../utils/classnames";

const tones = {
  teal: "bg-brand-tint text-brand",
  yellow: "bg-yellow-tint text-yellow-ink",
  pink: "bg-pink-tint text-pink",
  peri: "bg-peri-tint text-peri",
} as const;

export type IconTileTone = keyof typeof tones;

interface IconTileProps {
  icon: LucideIcon;
  tone?: IconTileTone;
  className?: string;
}

export default function IconTile({
  icon: Icon,
  tone = "teal",
  className = "",
}: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-15 shrink-0 place-items-center rounded-tile",
        tones[tone],
        className
      )}
    >
      <Icon className="size-7" strokeWidth={2.25} />
    </span>
  );
}
