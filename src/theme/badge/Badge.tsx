import type { HTMLAttributes, ReactNode } from "react";
import cn from "../../utils/classnames";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "green" | "red" | "amber";
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
        "inline-flex items-center rounded-full border px-2 py-1 font-mono text-xs font-semibold",
        {
          "border-line bg-stone-50 text-slate-600": tone === "neutral",
          "border-green-200 bg-green-50 text-green-800": tone === "green",
          "border-red-200 bg-red-50 text-red-700": tone === "red",
          "border-amber-200 bg-amber-50 text-amber-800": tone === "amber",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
