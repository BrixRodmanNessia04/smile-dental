import Link from "next/link";

import { deletePost } from "@/features/posts/actions/deletePost";
import { publishPost } from "@/features/posts/actions/publishPost";
import { listAdminPosts } from "@/features/posts/services/post-query.service";
import PostStatusBadge from "@/components/posts/PostStatusBadge";
import { POST_STATUS } from "@/lib/constants/post-status";

export default async function Page() {
  const postsResult = await listAdminPosts();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Posts</h1>
        <Link className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700" href="/admin/posts/new">
          New post
        </Link>
      </div>

      {!postsResult.ok ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {postsResult.message}
        </p>
      ) : postsResult.data.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No posts found.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-700">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {postsResult.data.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-3 text-slate-900">{post.title}</td>
                  <td className="px-4 py-3 text-slate-700">{post.slug}</td>
                  <td className="px-4 py-3">
                    <PostStatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{new Date(post.updatedAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link className="text-slate-900 underline" href={`/admin/posts/${post.id}`}>
                        View
                      </Link>
                      <Link className="text-slate-900 underline" href={`/admin/posts/${post.id}/edit`}>
                        Edit
                      </Link>
                      {post.status !== POST_STATUS.PUBLISHED ? (
                        <form action={publishPost}>
                          <input name="postId" type="hidden" value={post.id} />
                          <button className="text-slate-900 underline" type="submit">
                            Publish
                          </button>
                        </form>
                      ) : null}
                      <form action={deletePost}>
                        <input name="postId" type="hidden" value={post.id} />
                        <button className="text-red-700 underline" type="submit">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
