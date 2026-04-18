import Link from "next/link";

import SectionHeader from "@/components/shared/SectionHeader";
import { listPublishedPosts } from "@/features/posts/services/post-query.service";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

const MOCK_UPDATES = [
  {
    id: "mock-1",
    title: "How to prepare for your first consultation",
    excerpt: "A quick checklist to make your first One Dental visit smooth and stress-free.",
    slug: "first-consultation-checklist",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "mock-2",
    title: "What to expect after a professional cleaning",
    excerpt: "Understand post-cleaning care and simple ways to protect your smile at home.",
    slug: "after-cleaning-guide",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "mock-3",
    title: "New appointment reminders now live",
    excerpt: "Patients can now receive clearer reminders and status updates directly in portal.",
    slug: "appointment-reminders-update",
    publishedAt: new Date().toISOString(),
  },
] as const;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );

export default async function UpdatesSection() {
  const postsResult = await listPublishedPosts(3);
  const posts = postsResult.ok && postsResult.data.length > 0 ? postsResult.data : MOCK_UPDATES;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8" id="updates">
      <SectionHeader
        action={
          <Link className="text-sm font-semibold text-primary transition hover:text-primary-strong" href={MARKETING_ROUTES.UPDATES}>
            View All Updates
          </Link>
        }
        description="Latest clinic announcements, oral health tips, and patient updates."
        title="Updates"
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <article className="rounded-lg border border-border bg-card-strong p-5" key={post.id}>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {formatDate(post.publishedAt ?? new Date().toISOString())}
            </p>
            <h3 className="mt-2 text-base font-semibold text-foreground">{post.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {post.excerpt ?? "Read the latest update from the One Dental team."}
            </p>
            <Link
              className="mt-4 inline-flex text-sm font-semibold text-primary transition hover:text-primary-strong"
              href={`${MARKETING_ROUTES.UPDATES}/${post.slug}`}
            >
              Read update
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
