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
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition",
        {
          "border-ink bg-ink text-white": active,
          "border-line bg-white text-slate-600 hover:border-slate-400 hover:text-ink":
            !active,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
