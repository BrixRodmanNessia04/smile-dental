"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

function Sheet({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-foreground/45 backdrop-blur-[1px]", className)}
      {...props}
    />
  );
}

type SheetSide = "top" | "bottom" | "left" | "right";

const sideClassName: Record<SheetSide, string> = {
  top: "inset-x-0 top-0 rounded-b-xl border-b",
  bottom: "inset-x-0 bottom-0 rounded-t-xl border-t",
  left: "inset-y-0 left-0 h-full w-[min(100%-1rem,22rem)] rounded-r-xl border-r",
  right: "inset-y-0 right-0 h-full w-[min(100%-1rem,22rem)] rounded-l-xl border-l",
};

function SheetContent({
  className,
  children,
  side = "right",
  showClose = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  side?: SheetSide;
  showClose?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-card p-5 text-card-foreground shadow-xl",
          sideClassName[side],
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close
            className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            type="button"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
              <path d="M6 6l12 12M6 18 18 6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            </svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1.5", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-5 flex flex-wrap justify-end gap-2", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-base font-semibold text-foreground", className)} {...props} />;
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};

export default Sheet;
