import cn from "../../utils/classnames";

export type ButtonVariant = "primary" | "secondary" | "quiet";

export function buttonClasses(
  variant: ButtonVariant,
  small: boolean,
  className = ""
): string {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 font-heading font-bold no-underline transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-45",
    variant === "quiet"
      ? "font-mono text-sm font-medium text-brand hover:text-brand-deep hover:underline hover:underline-offset-4"
      : cn("rounded-full", small ? "min-h-10 px-4 text-sm" : "min-h-12 px-6"),
    {
      "bg-brand text-white hover:bg-brand-deep hover:text-white hover:no-underline":
        variant === "primary",
      "border-2 border-ink bg-white text-ink hover:bg-surface-muted hover:text-ink hover:no-underline":
        variant === "secondary",
    },
    className
  );
}
