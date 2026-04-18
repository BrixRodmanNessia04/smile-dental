import Link from "next/link";

import SectionHeader from "@/components/shared/SectionHeader";
import EmptyState from "@/components/ui/empty-state";
import { listActiveServices } from "@/features/appointments/services/appointment-query.service";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

const FALLBACK_SERVICES = [
  { id: "cleaning", name: "Preventive Cleaning", durationMinutes: 45 },
  { id: "checkup", name: "Oral Checkup", durationMinutes: 30 },
  { id: "restorative", name: "Restorative Treatment", durationMinutes: 60 },
] as const;

function ServiceIcon({ index }: { index: number }) {
  const iconId = index % 3;

  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        {iconId === 0 ? (
          <>
            <path d="M12 3a4 4 0 0 1 4 4v2a4 4 0 1 1-8 0V7a4 4 0 0 1 4-4Z" />
            <path d="M12 13v8" />
          </>
        ) : null}

        {iconId === 1 ? (
          <>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </>
        ) : null}

        {iconId === 2 ? (
          <>
            <path d="M7 5h10v14H7z" />
            <path d="M9 9h6" />
          </>
        ) : null}
      </g>
    </svg>
  );
}

function getDescription(name: string, minutes: number) {
  return `${name} appointments typically take around ${minutes} minutes with personalized patient guidance.`;
}

export default async function ServicesSection() {
  const servicesResult = await listActiveServices();
  const services = servicesResult.ok ? servicesResult.data.slice(0, 6) : [...FALLBACK_SERVICES];

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8" id="services">
      <SectionHeader
        action={
          <Link
            className="text-sm font-semibold text-primary transition hover:text-primary-strong"
            href={MARKETING_ROUTES.SERVICES}
          >
            View All Services
          </Link>
        }
        description="Comprehensive care for preventive, cosmetic, and restorative needs."
        title="Services"
      />

      {services.length === 0 ? (
        <EmptyState
          actionHref={MARKETING_ROUTES.CONTACT}
          actionLabel="Contact Clinic"
          className="mt-6"
          description="We are updating our service catalog. Contact One Dental for immediate assistance."
          title="Services coming soon"
        />
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article className="rounded-lg border border-border bg-card-strong p-5" key={service.id}>
              <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <ServiceIcon index={index} />
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">{service.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {getDescription(service.name, service.durationMinutes)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
