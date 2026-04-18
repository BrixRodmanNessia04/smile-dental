export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

export function isPostStatus(value: unknown): value is PostStatus {
  return value === POST_STATUS.DRAFT || value === POST_STATUS.PUBLISHED;
}
