import Link from "next/link";
import { notFound } from "next/navigation";

import PostPreview from "@/components/posts/PostPreview";
import PostStatusBadge from "@/components/posts/PostStatusBadge";
import { deletePost } from "@/features/posts/actions/deletePost";
import { publishPost } from "@/features/posts/actions/publishPost";
import { getAdminPostById } from "@/features/posts/services/post-query.service";
import { POST_STATUS } from "@/lib/constants/post-status";

type PageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { postId } = await params;
  const postResult = await getAdminPostById(postId);

  if (!postResult.ok) {
    notFound();
  }

  const post = postResult.data;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Post details</h1>
          <PostStatusBadge status={post.status} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link className="text-sm font-medium text-slate-900 underline" href="/admin/posts">
            Back to posts
          </Link>
          <Link className="text-sm font-medium text-slate-900 underline" href={`/admin/posts/${post.id}/edit`}>
            Edit
          </Link>
          {post.status !== POST_STATUS.PUBLISHED ? (
            <form action={publishPost}>
              <input name="postId" type="hidden" value={post.id} />
              <button className="text-sm font-medium text-slate-900 underline" type="submit">
                Publish
              </button>
            </form>
          ) : null}
          <form action={deletePost}>
            <input name="postId" type="hidden" value={post.id} />
            <button className="text-sm font-medium text-red-700 underline" type="submit">
              Delete
            </button>
          </form>
        </div>
      </div>

      <PostPreview post={post} />
    </main>
  );
}
