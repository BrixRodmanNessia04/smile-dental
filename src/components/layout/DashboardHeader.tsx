import type { ReactNode } from "react";

import Card, { CardContent } from "@/components/ui/card";

type DashboardHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function DashboardHeader({
  title,
  description,
  actions,
}: DashboardHeaderProps) {
  return (
    <Card className="border-[hsl(var(--border-strong))] bg-[hsl(var(--card-strong))]">
      <CardContent className="flex flex-wrap items-start justify-between gap-4 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </CardContent>
    </Card>
  );
}
