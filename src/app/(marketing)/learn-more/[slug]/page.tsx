import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import CTASection from "@/components/marketing/CTASection";
import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import {
  getLearnMoreContent,
  getLearnMoreSlugs,
} from "@/content/learn-more";
import { MARKETING_ROUTES } from "@/lib/constants/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";

type LearnMorePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getLearnMoreSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: LearnMorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getLearnMoreContent(slug);

  if (!content) {
    return buildPageMetadata({
      title: "Learn More",
      description: "Learn more about One Dental care options and patient experience.",
      path: `/learn-more/${slug}`,
    });
  }

  return buildPageMetadata({
    title: content.title,
    description: content.description,
    path: `/learn-more/${slug}`,
    keywords: ["One Dental", content.title, "dental care details"],
  });
}

export default async function Page({ params }: LearnMorePageProps) {
  const { slug } = await params;
  const content = getLearnMoreContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <main className="marketing-page mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              Learn more
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-primary sm:text-4xl lg:text-5xl">
              {content.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {content.description}
            </p>
            <div className="mt-7 flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                className="marketing-button-hover w-full sm:w-auto"
                size="lg"
                variant="accent"
              >
                <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>
                  Book Appointment
                </Link>
              </Button>
              <Button
                asChild
                className="marketing-button-hover w-full sm:w-auto"
                size="lg"
                variant="outline"
              >
                <Link href={MARKETING_ROUTES.SERVICES}>View Services</Link>
              </Button>
            </div>
          </div>

          {content.imageSrc ? (
            <div className="relative min-h-[18rem] bg-secondary/30 lg:min-h-full">
              <Image
                alt={content.imageAlt ?? content.title}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={content.imageSrc}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/24 via-transparent to-card/10" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
        <div className="grid gap-4">
          {content.sections.map((section, index) => (
            <Card
              className="marketing-card-hover rounded-2xl border-border bg-card"
              key={section.heading}
            >
              <CardContent className="p-5 pt-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-primary">
                  {section.heading}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Ready to continue?
          </p>
          <h2 className="mt-2 text-xl font-semibold text-primary">
            Request a visit with One Dental
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your preferred schedule and the clinic team will guide you to
            the best next step.
          </p>
          <Button
            asChild
            className="marketing-button-hover mt-5 w-full"
            size="lg"
            variant="accent"
          >
            <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>
              Book Appointment
            </Link>
          </Button>
        </aside>
      </section>

      <CTASection />
    </main>
  );
}
