import type { PostStatus } from "@/lib/constants/post-status";

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  status: PostStatus;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Post = PostRow;
