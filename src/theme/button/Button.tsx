import type { ButtonHTMLAttributes } from "react";
import { buttonClasses, type ButtonVariant } from "./buttonClasses";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  small?: boolean;
  className?: string;
}

export default function Button({
  variant = "primary",
  small = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, small, className)} {...props}>
      {children}
    </button>
  );
}
