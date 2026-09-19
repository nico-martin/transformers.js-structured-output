import type { ButtonHTMLAttributes } from "react";
import cn from "../../utils/classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-45",
        {
          "bg-ink text-paper shadow-button hover:-translate-y-px hover:bg-slate-800":
            variant === "primary",
          "border border-line bg-white text-ink hover:border-slate-400 hover:bg-stone-50":
            variant === "secondary",
          "h-auto px-1 py-0 text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-ink":
            variant === "quiet",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
