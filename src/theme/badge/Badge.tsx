import type { HTMLAttributes, ReactNode } from "react";
import cn from "../../utils/classnames";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "brand" | "yellow" | "pink" | "alert";
  children: ReactNode;
  className?: string;
}

export default function Badge({
  tone = "neutral",
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-heading text-xs font-bold whitespace-nowrap",
        {
          "bg-surface-muted text-body": tone === "neutral",
          "bg-brand-tint text-brand-deep": tone === "brand",
          "bg-yellow-tint text-yellow-ink": tone === "yellow",
          "bg-pink-tint text-pink": tone === "pink",
          "bg-alert-tint text-alert": tone === "alert",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
