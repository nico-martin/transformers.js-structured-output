import type { AnchorHTMLAttributes } from "react";
import { buttonClasses, type ButtonVariant } from "./buttonClasses";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  small?: boolean;
  className?: string;
}

export default function ButtonLink({
  variant = "primary",
  small = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={buttonClasses(variant, small, className)} {...props}>
      {children}
    </a>
  );
}
