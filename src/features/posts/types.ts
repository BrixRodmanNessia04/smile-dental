import type { PostStatus } from "@/lib/constants/post-status";

export type PostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  status: PostStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostFieldErrors = {
  postId?: string[];
  title?: string[];
  slug?: string[];
  excerpt?: string[];
  content?: string[];
  coverImageUrl?: string[];
  seoTitle?: string[];
  seoDescription?: string[];
};

export type PostFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: PostFieldErrors;
};

export const INITIAL_POST_FORM_STATE: PostFormState = {
  status: "idle",
};

export type PostServiceResult<T> =
  | {
      ok: true;
      data: T;
      message?: string;
    }
  | {
      ok: false;
      message: string;
    };
