import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublishedPostBySlug } from "@/features/posts/services/post-query.service";
import { buildPageMetadata, humanizeSlug } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedPostBySlug(slug);

  if (!result.ok) {
    const fallbackTitle = humanizeSlug(slug) || "Update";
    return buildPageMetadata({
      title: `${fallbackTitle} | Dental Updates`,
      description: `Read about ${fallbackTitle.toLowerCase()} from our dental clinic updates and patient education articles.`,
      path: `/updates/${slug}`,
      keywords: ["dental updates", "oral health article", fallbackTitle.toLowerCase()],
    });
  }

  const post = result.data;

  return buildPageMetadata({
    title: post.seoTitle ?? `${post.title} | Dental Updates`,
    description:
      post.seoDescription ??
      post.excerpt ??
      `Read ${post.title.toLowerCase()} from our dental clinic updates and patient education articles.`,
    path: `/updates/${post.slug}`,
    keywords: ["dental updates", "oral health article", post.slug],
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPublishedPostBySlug(slug);

  if (!result.ok) {
    notFound();
  }

  const post = result.data;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{post.title}</h1>
        {post.excerpt ? <p className="mt-3 text-sm text-slate-700">{post.excerpt}</p> : null}
        <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-800">{post.content}</div>
      </article>
    </main>
  );
}
