import type { PostStatus } from "@/lib/constants/post-status";

import StatusBadge from "@/components/ui/status-badge";

type PostStatusBadgeProps = {
  status: PostStatus;
};

const STATUS_META: Record<PostStatus, { label: string; tone: "warning" | "success" }> = {
  draft: { label: "Draft", tone: "warning" },
  published: { label: "Published", tone: "success" },
};

export default function PostStatusBadge({ status }: PostStatusBadgeProps) {
  const meta = STATUS_META[status];
  return <StatusBadge label={meta.label} tone={meta.tone} />;
}
