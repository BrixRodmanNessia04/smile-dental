import Link from "next/link";

import ServiceCard from "@/components/marketing/ServiceCard";
import Button from "@/components/ui/button";
import { MARKETING_ROUTES } from "@/lib/constants/routes";
import { STATIC_MARKETING_SERVICES } from "@/lib/constants/services";

type ServicesSectionProps = {
  id?: string;
  title?: string;
  description?: string;
  limit?: number;
  showViewAll?: boolean;
  showBookCta?: boolean;
};

export default function ServicesSection({
  id = "services",
  title = "Our Services",
  description = "Comprehensive dental care designed for your whole family.",
  limit = 6,
  showViewAll = true,
  showBookCta = false,
}: ServicesSectionProps) {
  const services = STATIC_MARKETING_SERVICES.slice(0, limit);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8" id={id}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">One Dental services</p>
          <h2 className="mt-1 text-3xl font-semibold text-primary sm:text-4xl">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {showViewAll ? (
            <Button asChild className="marketing-button-hover" size="sm" variant="outline">
              <Link href={MARKETING_ROUTES.SERVICES}>View all services</Link>
            </Button>
          ) : null}
          {showBookCta ? (
            <Button asChild className="marketing-button-hover" size="sm" variant="accent">
              <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>Book Appointment</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {services.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              description={service.shortDescription}
              durationMinutes={service.durationMinutes ?? null}
              iconKey={service.iconKey}
              iconTone={index % 2 === 0 ? "primary" : "accent"}
              key={service.slug}
              name={service.name}
              priceLabel={service.priceLabel ?? null}
              serviceSlug={service.slug}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
