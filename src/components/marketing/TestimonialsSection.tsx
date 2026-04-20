import TestimonialCard from "@/components/marketing/TestimonialCard";
import Card, { CardContent } from "@/components/ui/card";
import { IMAGES } from "@/lib/constants/images";

const TESTIMONIALS = [
  {
    quote:
      "Booking was very easy and the team explained each step clearly. I felt comfortable from check-in to treatment.",
    name: "Angela R.",
    label: "Preventive Care Patient",
    avatarSrc: IMAGES.home.testimonialAngela,
    avatarAlt: "One Dental patient smiling during treatment",
  },
  {
    quote:
      "I was nervous about cosmetic work, but One Dental made the process smooth and personalized to my needs.",
    name: "Mark C.",
    label: "Cosmetic Dentistry Patient",
    avatarSrc: IMAGES.home.testimonialMark,
    avatarAlt: "One Dental patient during an appointment",
  },
  {
    quote:
      "The staff was warm, the clinic was modern, and follow-up communication was excellent.",
    name: "Sofia D.",
    label: "Restorative Care Patient",
    avatarSrc: IMAGES.home.testimonialSofia,
    avatarAlt: "One Dental clinical treatment setup",
  },
] as const;

export default function TestimonialsSection() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">Patient stories</p>
          <h2 className="mt-1 text-3xl font-semibold text-primary sm:text-4xl">
            Trusted by families across the community
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Real experiences from One Dental patients who value comfort, clarity, and quality care.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard
            avatarAlt={testimonial.avatarAlt}
            avatarSrc={testimonial.avatarSrc}
            key={testimonial.name}
            label={testimonial.label}
            name={testimonial.name}
            quote={testimonial.quote}
          />
        ))}
      </div>
    </section>
  );
}
