import Card, { CardContent } from "@/components/ui/card";

const BOOKING_STEPS = [
  "Share your contact details and visit goals.",
  "Choose a service from the live clinic catalog.",
  "Set a preferred date/time or pick an available slot.",
] as const;

export default function AppointmentHero() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Appointment booking</p>
      <h1 className="mt-2 text-3xl font-semibold text-primary sm:text-4xl">
        Book your One Dental visit in a few guided steps
      </h1>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
        This booking form is designed for mobile and desktop with clear step-by-step input and
        quick clinic confirmation.
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {BOOKING_STEPS.map((step, index) => (
          <Card className="rounded-xl border-border bg-card-strong" key={step}>
            <CardContent className="p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm text-foreground">{step}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
