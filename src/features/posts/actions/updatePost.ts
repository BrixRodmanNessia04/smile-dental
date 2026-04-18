"use server";

import { revalidatePath } from "next/cache";

import { ADMIN_ROUTES, MARKETING_ROUTES } from "@/lib/constants/routes";

import { updatePostSchema } from "../schemas/post.schema";
import { updatePostByAdmin } from "../services/post.service";
import type { PostFormState } from "../types";

export async function updatePost(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const parsed = updatePostSchema.safeParse({
    postId: formData.get("postId"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content"),
    coverImageUrl: formData.get("coverImageUrl") ?? "",
    seoTitle: formData.get("seoTitle") ?? "",
    seoDescription: formData.get("seoDescription") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await updatePostByAdmin(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  revalidatePath(ADMIN_ROUTES.POSTS);
  revalidatePath(`${ADMIN_ROUTES.POSTS}/${result.data.id}`);
  revalidatePath(`${ADMIN_ROUTES.POSTS}/${result.data.id}/edit`);
  revalidatePath(MARKETING_ROUTES.UPDATES);
  revalidatePath(`${MARKETING_ROUTES.UPDATES}/${result.data.slug}`);
  revalidatePath(MARKETING_ROUTES.HOME);

  return {
    status: "success",
    message: "Post updated successfully.",
  };
}
