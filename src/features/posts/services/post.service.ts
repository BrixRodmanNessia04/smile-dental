import { resolveUserRole } from "@/lib/auth/roles";
import { POST_STATUS } from "@/lib/constants/post-status";
import { USER_ROLES } from "@/lib/constants/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notifyPostPublished } from "@/features/notifications/services/notification.service";
import type { Database } from "@/types/database";

import type {
  CreatePostInput,
  UpdatePostInput,
} from "../schemas/post.schema";
import type { PostItem, PostServiceResult } from "../types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type Supabase = Awaited<ReturnType<typeof createServerSupabaseClient>>;

const mapPost = (row: PostRow): PostItem => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  content: row.content,
  coverImageUrl: row.cover_image_url,
  status: row.status,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
  publishedAt: row.published_at,
  createdBy: row.created_by,
  updatedBy: row.updated_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const unauthorized = <T>(): PostServiceResult<T> => ({
  ok: false,
  message: "You are not authorized to perform this action.",
});

async function getAdminContext(): Promise<
  PostServiceResult<{
    supabase: Supabase;
    adminProfileId: string;
  }>
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return unauthorized();
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      ok: false,
      message: "Unable to validate your account role.",
    };
  }

  const role = resolveUserRole(profile.role, user);
  if (role !== USER_ROLES.ADMIN) {
    return unauthorized();
  }

  return {
    ok: true,
    data: {
      supabase,
      adminProfileId: profile.id,
    },
  };
}

async function ensureSlugUnique(
  supabase: Supabase,
  slug: string,
  exceptPostId?: string,
): Promise<boolean> {
  const query = supabase.from("posts").select("id").eq("slug", slug);
  const filteredQuery = exceptPostId ? query.neq("id", exceptPostId) : query;

  const { data, error } = await filteredQuery.maybeSingle();

  if (error) {
    return false;
  }

  return !data;
}

async function notifyPatientsForPublishedPost(
  supabase: Supabase,
  post: PostRow,
) {
  const { data: recipients } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", USER_ROLES.PATIENT)
    .eq("is_active", true);

  if (!recipients || recipients.length === 0) {
    return;
  }

  await Promise.all(
    recipients.map((recipient) =>
      notifyPostPublished({
        recipientProfileId: recipient.id,
        postId: post.id,
        title: post.title,
      }),
    ),
  );
}

export async function createPostByAdmin(
  input: CreatePostInput,
): Promise<PostServiceResult<PostItem>> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, adminProfileId } = contextResult.data;

  const isUnique = await ensureSlugUnique(supabase, input.slug);
  if (!isUnique) {
    return {
      ok: false,
      message: "Slug is already in use.",
    };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt ?? null,
      content: input.content,
      cover_image_url: input.coverImageUrl ?? null,
      status: POST_STATUS.DRAFT,
      seo_title: input.seoTitle ?? null,
      seo_description: input.seoDescription ?? null,
      created_by: adminProfileId,
      updated_by: adminProfileId,
    })
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: "Unable to create post.",
    };
  }

  return {
    ok: true,
    data: mapPost(data),
  };
}

export async function updatePostByAdmin(
  input: UpdatePostInput,
): Promise<PostServiceResult<PostItem>> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, adminProfileId } = contextResult.data;

  const { data: existing, error: existingError } = await supabase
    .from("posts")
    .select("id")
    .eq("id", input.postId)
    .maybeSingle();

  if (existingError || !existing) {
    return {
      ok: false,
      message: "Post not found.",
    };
  }

  const isUnique = await ensureSlugUnique(supabase, input.slug, input.postId);
  if (!isUnique) {
    return {
      ok: false,
      message: "Slug is already in use.",
    };
  }

  const { data, error } = await supabase
    .from("posts")
    .update({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt ?? null,
      content: input.content,
      cover_image_url: input.coverImageUrl ?? null,
      seo_title: input.seoTitle ?? null,
      seo_description: input.seoDescription ?? null,
      updated_by: adminProfileId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.postId)
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: "Unable to update post.",
    };
  }

  return {
    ok: true,
    data: mapPost(data),
  };
}

export async function publishPostByAdmin(
  postId: string,
): Promise<PostServiceResult<PostItem>> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase, adminProfileId } = contextResult.data;

  const { data: existing, error: existingError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .maybeSingle();

  if (existingError || !existing) {
    return {
      ok: false,
      message: "Post not found.",
    };
  }

  const wasPublished = existing.status === POST_STATUS.PUBLISHED;

  const { data, error } = await supabase
    .from("posts")
    .update({
      status: POST_STATUS.PUBLISHED,
      published_at: existing.published_at ?? new Date().toISOString(),
      updated_by: adminProfileId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .select("*")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: "Unable to publish post.",
    };
  }

  if (!wasPublished) {
    await notifyPatientsForPublishedPost(supabase, data);
  }

  return {
    ok: true,
    data: mapPost(data),
  };
}

export async function deletePostByAdmin(
  postId: string,
): Promise<PostServiceResult<null>> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase } = contextResult.data;

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    return {
      ok: false,
      message: "Unable to delete post.",
    };
  }

  return {
    ok: true,
    data: null,
  };
}
