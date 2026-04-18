import type { PostItem } from "@/features/posts/types";

type PostPreviewProps = {
  post: PostItem;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function PostPreview({ post }: PostPreviewProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{post.title}</h1>
      <p className="mt-2 text-sm text-slate-500">Published: {formatDate(post.publishedAt)}</p>
      {post.excerpt ? <p className="mt-4 text-sm text-slate-700">{post.excerpt}</p> : null}
      <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-800">{post.content}</div>
    </article>
  );
}
