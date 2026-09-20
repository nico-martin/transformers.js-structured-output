import type { ButtonHTMLAttributes } from "react";
import cn from "../../utils/classnames";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  className?: string;
}

export default function Chip({
  active = false,
  className = "",
  children,
  ...props
}: ChipProps) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border-2 px-4 py-1.5 font-heading text-sm font-bold transition",
        {
          "border-ink bg-ink text-white": active,
          "border-ink bg-white text-body hover:text-ink": !active,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
