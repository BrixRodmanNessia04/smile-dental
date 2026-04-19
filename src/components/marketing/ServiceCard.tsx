import Link from "next/link";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import { MARKETING_ROUTES } from "@/lib/constants/routes";
import type { MarketingServiceIconKey } from "@/lib/constants/services";

type ServiceCardProps = {
  serviceSlug: string;
  name: string;
  description: string;
  durationMinutes?: number | null;
  basePrice?: number | null;
  priceLabel?: string | null;
  iconKey?: MarketingServiceIconKey;
  iconTone?: "primary" | "accent";
};

function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function ServiceIcon({
  iconKey,
  tone = "primary",
}: {
  iconKey?: MarketingServiceIconKey;
  tone?: "primary" | "accent";
}) {
  const toneClassName = tone === "accent" ? "text-accent" : "text-primary";

  return (
    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background ${toneClassName}`}>
      {iconKey === "cosmetic" || iconKey === "whitening" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path d="M12 4v3m0 10v3m8-8h-3M7 12H4m13.7 5.7-2.1-2.1M8.4 8.4 6.3 6.3m11.4 0-2.1 2.1M8.4 15.6l-2.1 2.1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      ) : iconKey === "implant" || iconKey === "restorative" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path d="M12 4v4m0 0a3 3 0 0 1 3 3v8H9v-8a3 3 0 0 1 3-3Zm-2 8h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      ) : iconKey === "orthodontics" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <rect height="8" rx="2" stroke="currentColor" strokeWidth="1.7" width="14" x="5" y="8" />
          <path d="M9 8v8m6-8v8m-8-4h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
      ) : (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path
            d="M6.2 4.8c1.2-1.1 3-.9 4.2-.2l1.6.9 1.6-.9c1.2-.7 3-.9 4.2.2 1.8 1.6 2.1 4.3.8 6.6-.9 1.6-1.4 2.7-1.8 4.1l-.7 2.8c-.2.8-1.2.9-1.5.2l-1.1-2.5c-.3-.6-1.1-.6-1.4 0l-1.1 2.5c-.3.7-1.3.6-1.5-.2l-.7-2.8c-.4-1.4-.9-2.5-1.8-4.1-1.3-2.3-1-5 .8-6.6Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
        </svg>
      )}
    </span>
  );
}

export default function ServiceCard({
  serviceSlug,
  name,
  description,
  durationMinutes,
  basePrice,
  priceLabel,
  iconKey,
  iconTone = "primary",
}: ServiceCardProps) {
  const price = formatPrice(basePrice);
  const pricing = priceLabel ?? price;

  return (
    <Card
      className="h-full overflow-hidden rounded-2xl border-border bg-card shadow-[0_18px_46px_-34px_hsl(var(--shadow))]"
      id={serviceSlug}
    >
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex rounded-2xl bg-primary/10 p-1.5">
            <ServiceIcon iconKey={iconKey} tone={iconTone} />
          </div>
          <div className="flex flex-wrap justify-end gap-1.5">
            {durationMinutes ? <Badge variant="primary">{durationMinutes} min</Badge> : null}
            {pricing ? <Badge variant="accent">{pricing}</Badge> : null}
          </div>
        </div>

        <h3 className="mt-4 text-xl font-semibold text-primary break-words">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">{description}</p>

        <div className="mt-5">
          <Button asChild className="w-full sm:w-auto" size="sm" variant="outline">
            <Link href={`${MARKETING_ROUTES.SERVICES}#${serviceSlug}`}>Learn More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
