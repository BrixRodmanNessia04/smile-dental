"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_ROUTES, MARKETING_ROUTES } from "@/lib/constants/routes";

import { createPostSchema } from "../schemas/post.schema";
import { createPostByAdmin } from "../services/post.service";
import type { PostFormState } from "../types";

export async function createPost(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const parsed = createPostSchema.safeParse({
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

  const result = await createPostByAdmin(parsed.data);
  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  revalidatePath(ADMIN_ROUTES.POSTS);
  revalidatePath(MARKETING_ROUTES.UPDATES);
  revalidatePath(MARKETING_ROUTES.HOME);

  redirect(`${ADMIN_ROUTES.POSTS}/${result.data.id}`);
}
