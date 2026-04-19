"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-base text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <svg aria-hidden="true" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 max-h-80 w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-1rem)] overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-lg",
          position === "popper" && "translate-y-1",
          className,
        )}
        collisionPadding={8}
        position={position}
        sideOffset={6}
        {...props}
      >
        <SelectPrimitive.Viewport className="max-h-[min(20rem,var(--radix-select-content-available-height))] p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-2 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-base text-foreground outline-none transition focus:bg-muted disabled:pointer-events-none disabled:opacity-50 sm:text-sm",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 inline-flex h-4 w-4 items-center justify-center text-primary">
        <SelectPrimitive.ItemIndicator>
          <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <path d="m5 12 5 5L20 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn("my-1 h-px bg-border", className)} {...props} />;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};

export default Select;
