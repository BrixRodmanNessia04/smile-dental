import Image from "next/image";

import Card, { CardContent } from "@/components/ui/card";
import { IMAGES } from "@/lib/constants/images";

type SplitFeatureSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  align?: "left" | "right";
  visualLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export default function SplitFeatureSection({
  eyebrow,
  title,
  description,
  bullets,
  align = "left",
  visualLabel = "Clinic Visual Placeholder",
  imageSrc = IMAGES.home.preventive,
  imageAlt = "Patient receiving gentle dental care at One Dental",
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
        </div>

        <Card className="overflow-hidden rounded-2xl border-border bg-secondary/30">
          <CardContent className="p-0">
            <div className="relative aspect-[16/10] w-full">
              <Image alt={imageAlt} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 50vw" src={imageSrc} />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/18 via-transparent to-card/25" />
              <div className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
                One Dental
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border/80 bg-card/88 p-3 backdrop-blur-sm sm:p-4">
                <p className="text-sm font-semibold text-foreground">{visualLabel}</p>
                <p className="mt-1 text-xs text-muted-foreground">Temporary photo placeholder for final clinic media.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
