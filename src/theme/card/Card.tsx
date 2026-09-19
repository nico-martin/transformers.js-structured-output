import type { HTMLAttributes, ReactNode } from "react";
import cn from "../../utils/classnames";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-white shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
