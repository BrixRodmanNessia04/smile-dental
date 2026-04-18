import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          className="mt-4 inline-flex items-center rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
