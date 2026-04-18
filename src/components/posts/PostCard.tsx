import Link from "next/link";

import type { PostItem } from "@/features/posts/types";

type PostCardProps = {
  post: PostItem;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
};

export default function PostCard({ post }: PostCardProps) {
  const publishedLabel = formatDate(post.publishedAt);

  return (
    <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">
        <Link className="transition hover:text-primary" href={`/updates/${post.slug}`}>
          {post.title}
        </Link>
      </h2>

      {post.excerpt ? <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p> : null}

      {publishedLabel ? (
        <p className="mt-3 text-xs text-muted-foreground">Published {publishedLabel}</p>
      ) : null}

      <Link
        className="mt-3 inline-block text-sm font-semibold text-primary transition hover:text-primary-strong"
        href={`/updates/${post.slug}`}
      >
        Read update
      </Link>
    </article>
  );
}
