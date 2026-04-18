import { z } from "zod";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const cleanOptionalText = (value: string | null | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const cleanOptionalUrl = (value: string | null | undefined) => {
  const cleaned = cleanOptionalText(value);
  if (!cleaned) {
    return undefined;
  }

  return cleaned;
};

export const postIdSchema = z.object({
  postId: z.string().uuid("Invalid post id."),
});

export const postInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Slug is required.")
    .max(200)
    .regex(SLUG_REGEX, "Slug must use lowercase letters, numbers, and dashes."),
  excerpt: z
    .string()
    .transform((value) => cleanOptionalText(value))
    .refine((value) => !value || value.length <= 500, {
      message: "Excerpt must not exceed 500 characters.",
    })
    .optional(),
  content: z.string().trim().min(1, "Content is required."),
  coverImageUrl: z
    .string()
    .transform((value) => cleanOptionalUrl(value))
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: "Cover image URL must be a valid URL.",
    })
    .optional(),
  seoTitle: z
    .string()
    .transform((value) => cleanOptionalText(value))
    .refine((value) => !value || value.length <= 200, {
      message: "SEO title must not exceed 200 characters.",
    })
    .optional(),
  seoDescription: z
    .string()
    .transform((value) => cleanOptionalText(value))
    .refine((value) => !value || value.length <= 300, {
      message: "SEO description must not exceed 300 characters.",
    })
    .optional(),
});

export const createPostSchema = postInputSchema;

export const updatePostSchema = postIdSchema.merge(postInputSchema);

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
