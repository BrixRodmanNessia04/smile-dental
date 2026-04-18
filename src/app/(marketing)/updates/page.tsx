import type { Metadata } from "next";

import PostCard from "@/components/posts/PostCard";
import { listPublishedPosts } from "@/features/posts/services/post-query.service";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Dental Updates and Articles",
  description:
    "Read the latest clinic updates, oral care tips, and dental health insights from our team.",
  path: "/updates",
  keywords: ["dental updates", "oral health tips", "dental blog"],
});

export default async function Page() {
  const postsResult = await listPublishedPosts(24);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Updates</h1>
      <p className="mt-2 text-sm text-slate-600">
        Latest clinic news, oral health advice, and patient education.
      </p>

      {!postsResult.ok ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {postsResult.message}
        </p>
      ) : postsResult.data.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No published updates yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {postsResult.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
