"use client";

import { useActionState } from "react";

import {
  INITIAL_POST_FORM_STATE,
  type PostFormState,
  type PostItem,
} from "@/features/posts/types";

type PostEditorFormProps = {
  action: (
    previousState: PostFormState,
    formData: FormData,
  ) => Promise<PostFormState>;
  post?: PostItem;
  submitLabel: string;
};

export default function PostEditorForm({
  action,
  post,
  submitLabel,
}: PostEditorFormProps) {
  const [state, formAction, isPending] = useActionState<PostFormState, FormData>(
    action,
    INITIAL_POST_FORM_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      {post ? <input name="postId" type="hidden" value={post.id} /> : null}

      {state.message ? (
        <p
          className={
            state.status === "success" ? "text-sm text-green-700" : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          defaultValue={post?.title ?? ""}
          id="title"
          name="title"
          required
          type="text"
        />
        {state.errors?.title?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.title[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="slug">
          Slug
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          defaultValue={post?.slug ?? ""}
          id="slug"
          name="slug"
          placeholder="example-update-title"
          required
          type="text"
        />
        {state.errors?.slug?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.slug[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="excerpt">
          Excerpt
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          defaultValue={post?.excerpt ?? ""}
          id="excerpt"
          name="excerpt"
          rows={3}
        />
        {state.errors?.excerpt?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.excerpt[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="content">
          Content
        </label>
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          defaultValue={post?.content ?? ""}
          id="content"
          name="content"
          required
          rows={12}
        />
        {state.errors?.content?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.content[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="coverImageUrl">
          Cover image URL
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
          defaultValue={post?.coverImageUrl ?? ""}
          id="coverImageUrl"
          name="coverImageUrl"
          type="url"
        />
        {state.errors?.coverImageUrl?.[0] ? (
          <p className="text-sm text-red-600">{state.errors.coverImageUrl[0]}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="seoTitle">
            SEO title
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            defaultValue={post?.seoTitle ?? ""}
            id="seoTitle"
            name="seoTitle"
            type="text"
          />
          {state.errors?.seoTitle?.[0] ? (
            <p className="text-sm text-red-600">{state.errors.seoTitle[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="seoDescription">
            SEO description
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            defaultValue={post?.seoDescription ?? ""}
            id="seoDescription"
            name="seoDescription"
            rows={3}
          />
          {state.errors?.seoDescription?.[0] ? (
            <p className="text-sm text-red-600">{state.errors.seoDescription[0]}</p>
          ) : null}
        </div>
      </div>

      <button
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
