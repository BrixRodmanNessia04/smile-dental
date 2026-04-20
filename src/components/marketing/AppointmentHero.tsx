import Card, { CardContent } from "@/components/ui/card";

const BOOKING_STEPS = [
  "Share your contact details and visit goals.",
  "Choose from the One Dental MVP service list.",
  "Send your preferred date and time for confirmation.",
] as const;

export default function AppointmentHero() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Appointment booking</p>
      <h1 className="mt-2 text-3xl font-semibold text-primary sm:text-4xl">
        Request your One Dental appointment online
      </h1>
      <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
        Fill out the public request form below. Our clinic team will review your preferred schedule
        and follow up to confirm the appointment.
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {BOOKING_STEPS.map((step, index) => (
          <Card className="rounded-xl border-border bg-card-strong" key={step}>
            <CardContent className="p-3 pt-3">
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
