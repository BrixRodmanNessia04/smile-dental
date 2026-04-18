"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_ROUTES, MARKETING_ROUTES } from "@/lib/constants/routes";

import { postIdSchema } from "../schemas/post.schema";
import { deletePostByAdmin } from "../services/post.service";

export async function deletePost(formData: FormData) {
  const parsed = postIdSchema.safeParse({
    postId: formData.get("postId"),
  });

  if (!parsed.success) {
    redirect(ADMIN_ROUTES.POSTS);
  }

  const result = await deletePostByAdmin(parsed.data.postId);
  if (!result.ok) {
    redirect(ADMIN_ROUTES.POSTS);
  }

  revalidatePath(ADMIN_ROUTES.POSTS);
  revalidatePath(MARKETING_ROUTES.UPDATES);
  revalidatePath(MARKETING_ROUTES.HOME);

  redirect(ADMIN_ROUTES.POSTS);
}
