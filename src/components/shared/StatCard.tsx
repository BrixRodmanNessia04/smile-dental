import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import Card, { CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  className?: string;
};

export default function StatCard({ label, value, hint, icon, className }: StatCardProps) {
  return (
    <Card className={cn("h-full border-border", className)}>
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {label}
            </p>
            <p className="break-words text-2xl font-semibold text-foreground">{value}</p>
          </div>
          {icon ? (
            <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
          ) : null}
        </div>
        {hint ? <p className="mt-auto break-words text-sm text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
