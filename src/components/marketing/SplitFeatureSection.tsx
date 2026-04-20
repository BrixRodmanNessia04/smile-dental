import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/button";
import { IMAGES } from "@/lib/constants/images";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

type SplitFeatureSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  align?: "left" | "right";
  visualLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  learnMoreSlug?: string;
  learnMoreLabel?: string;
};

export default function SplitFeatureSection({
  eyebrow,
  title,
  description,
  bullets,
  align = "left",
  visualLabel = "One Dental Clinic",
  imageSrc = IMAGES.home.preventive,
  imageAlt = "Patient receiving gentle dental care at One Dental",
  learnMoreSlug,
  learnMoreLabel = "Learn More",
}: SplitFeatureSectionProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div
        className={`grid gap-6 lg:grid-cols-2 lg:items-center ${
          align === "right" ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">{eyebrow}</p>
          <h2 className="text-2xl font-semibold leading-tight text-primary sm:text-3xl">{title}</h2>
          <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
          <ul className="grid gap-2">
            {bullets.map((item) => (
              <li className="flex items-start gap-2 text-sm text-foreground" key={item}>
                <span className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {learnMoreSlug ? (
            <div className="pt-2">
              <Button
                asChild
                className="marketing-button-hover w-full sm:w-auto"
                size="sm"
                variant="outline"
              >
                <Link href={`${MARKETING_ROUTES.LEARN_MORE}/${learnMoreSlug}`}>
                  {learnMoreLabel}
                </Link>
              </Button>
            </div>
          ) : null}
        </div>

        <div className="marketing-card-hover relative overflow-hidden rounded-[1.7rem] border border-border/65 bg-secondary/20 shadow-[0_24px_52px_-42px_hsl(var(--shadow))]">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[5/4]">
            <Image alt={imageAlt} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 50vw" src={imageSrc} />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/22 via-transparent to-card/10" />
            <div className="absolute left-4 top-4 rounded-full bg-background/82 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
              {visualLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
