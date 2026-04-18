import Link from "next/link";
import { notFound } from "next/navigation";

import PostEditorForm from "@/components/posts/PostEditorForm";
import { updatePost } from "@/features/posts/actions/updatePost";
import { getAdminPostById } from "@/features/posts/services/post-query.service";

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

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit post</h1>
        <p className="mt-1 text-sm text-slate-600">Update title, slug, content, and SEO fields.</p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <PostEditorForm action={updatePost} post={postResult.data} submitLabel="Save changes" />
      </section>

      <Link className="text-sm font-medium text-slate-900 underline" href={`/admin/posts/${postResult.data.id}`}>
        Back to post
      </Link>
    </main>
  );
}
