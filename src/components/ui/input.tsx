import * as React from "react";

import { cn } from "@/lib/utils/cn";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground shadow-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm",
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
export default Input;
