import type { ReactNode } from "react";

interface SectionHeadingProps {
  number: string;
  title: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeading({
  number,
  title,
  action,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-3 flex items-center justify-between ${className}`}>
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-xs text-slate-400">{number}</span>
        <h2 className="text-sm font-semibold tracking-tight text-ink">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
