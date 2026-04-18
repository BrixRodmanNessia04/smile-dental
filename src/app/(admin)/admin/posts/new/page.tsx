import Link from "next/link";

import PostEditorForm from "@/components/posts/PostEditorForm";
import { createPost } from "@/features/posts/actions/createPost";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create post</h1>
        <p className="mt-1 text-sm text-slate-600">Create a draft update for the public updates page.</p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <PostEditorForm action={createPost} submitLabel="Create post" />
      </section>

      <Link className="text-sm font-medium text-slate-900 underline" href="/admin/posts">
        Back to posts
      </Link>
    </main>
  );
}
