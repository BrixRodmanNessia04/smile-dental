import { resolveUserRole } from "@/lib/auth/roles";
import { POST_STATUS } from "@/lib/constants/post-status";
import { USER_ROLES } from "@/lib/constants/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import type { PostItem, PostServiceResult } from "../types";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];

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

async function getAdminContext() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false as const,
      message: "You are not authorized.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      ok: false as const,
      message: "Unable to validate your account role.",
    };
  }

  const role = resolveUserRole(profile.role, user);
  if (role !== USER_ROLES.ADMIN) {
    return {
      ok: false as const,
      message: "You are not authorized.",
    };
  }

  return {
    ok: true as const,
    data: {
      supabase,
    },
  };
}

export async function listPublishedPosts(
  limit = 20,
): Promise<PostServiceResult<PostItem[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", POST_STATUS.PUBLISHED)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      ok: false,
      message: "Unable to load updates.",
    };
  }

  return {
    ok: true,
    data: (data ?? []).map(mapPost),
  };
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<PostServiceResult<PostItem>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", POST_STATUS.PUBLISHED)
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      message: "Update not found.",
    };
  }

  return {
    ok: true,
    data: mapPost(data),
  };
}

export async function listAdminPosts(): Promise<PostServiceResult<PostItem[]>> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase } = contextResult.data;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      message: "Unable to load posts.",
    };
  }

  return {
    ok: true,
    data: (data ?? []).map(mapPost),
  };
}

export async function getAdminPostById(
  postId: string,
): Promise<PostServiceResult<PostItem>> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) {
    return contextResult;
  }

  const { supabase } = contextResult.data;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      message: "Post not found.",
    };
  }

  return {
    ok: true,
    data: mapPost(data),
  };
}
