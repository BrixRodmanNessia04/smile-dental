import Image from "next/image";

import Card, { CardContent } from "@/components/ui/card";

type TestimonialCardProps = {
  quote: string;
  name: string;
  label: string;
  avatarSrc: string;
  avatarAlt: string;
};

export default function TestimonialCard({
  quote,
  name,
  label,
  avatarSrc,
  avatarAlt,
}: TestimonialCardProps) {
  return (
    <Card className="h-full rounded-2xl border-border bg-card shadow-[0_16px_40px_-34px_hsl(var(--shadow))]">
      <CardContent className="flex h-full flex-col p-5 pt-5 sm:p-6">
        <div className="mb-4 inline-flex items-center gap-1 text-accent" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg className="h-4 w-4" fill="currentColor" key={index} viewBox="0 0 20 20">
              <path d="m10 2.5 2.3 4.6 5 .7-3.6 3.5.9 5-4.6-2.4-4.6 2.4.9-5L2.7 7.8l5-.7L10 2.5Z" />
            </svg>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground break-words">“{quote}”</p>

        <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border bg-muted">
            <Image alt={avatarAlt} className="object-cover" fill sizes="44px" src={avatarSrc} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-primary">{name}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
