import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

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

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
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
  sm: "h-11 rounded-lg px-3 text-base sm:h-9 sm:text-sm",
  md: "h-11 rounded-lg px-4 text-base sm:h-10 sm:text-sm",
  lg: "h-11 rounded-lg px-5 text-base",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
export default Button;
