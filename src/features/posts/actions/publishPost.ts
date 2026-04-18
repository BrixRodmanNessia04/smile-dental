"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ADMIN_ROUTES, MARKETING_ROUTES } from "@/lib/constants/routes";

import { postIdSchema } from "../schemas/post.schema";
import { publishPostByAdmin } from "../services/post.service";

export async function publishPost(formData: FormData) {
  const parsed = postIdSchema.safeParse({
    postId: formData.get("postId"),
  });

  if (!parsed.success) {
    redirect(ADMIN_ROUTES.POSTS);
  }

  const result = await publishPostByAdmin(parsed.data.postId);
  if (!result.ok) {
    redirect(ADMIN_ROUTES.POSTS);
  }

  revalidatePath(ADMIN_ROUTES.POSTS);
  revalidatePath(`${ADMIN_ROUTES.POSTS}/${result.data.id}`);
  revalidatePath(`${ADMIN_ROUTES.POSTS}/${result.data.id}/edit`);
  revalidatePath(MARKETING_ROUTES.UPDATES);
  revalidatePath(`${MARKETING_ROUTES.UPDATES}/${result.data.slug}`);
  revalidatePath(MARKETING_ROUTES.HOME);

  redirect(`${ADMIN_ROUTES.POSTS}/${result.data.id}`);
}
