import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant =
  | "primary"
  | "accent"
  | "ghost"
  | "outline"
  | "secondary"
  | "destructive"
  | "default";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-strong focus-visible:ring-primary/35",
  default:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-strong focus-visible:ring-primary/35",
  accent: "bg-accent text-accent-foreground shadow-sm hover:brightness-95 focus-visible:ring-accent/35",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary-strong focus-visible:ring-primary/20",
  ghost: "bg-transparent text-foreground hover:bg-muted focus-visible:ring-primary/20",
  outline:
    "border border-border bg-background text-foreground hover:bg-muted focus-visible:ring-primary/20",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-strong focus-visible:ring-destructive/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-lg px-3 text-sm",
  md: "h-10 rounded-lg px-4 text-sm",
  lg: "h-11 rounded-lg px-5 text-base",
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
