import type { HTMLAttributes, ReactNode } from "react";
import cn from "../../utils/classnames";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
  className?: string;
}

export default function Card({
  children,
  padded = true,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border-2 border-ink bg-white shadow-soft",
        { "p-7": padded },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
