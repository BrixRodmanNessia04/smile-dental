import type { AppointmentStatus } from "@/lib/constants/appointment-status";

import StatusBadge from "@/components/ui/status-badge";

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus;
};

const STATUS_META: Record<
  AppointmentStatus,
  { label: string; tone: "neutral" | "info" | "success" | "warning" | "danger" }
> = {
  pending: { label: "Pending", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  rescheduled: { label: "Rescheduled", tone: "info" },
  cancelled: { label: "Cancelled", tone: "danger" },
  completed: { label: "Completed", tone: "success" },
  no_show: { label: "No show", tone: "warning" },
  rejected: { label: "Rejected", tone: "neutral" },
};

export default function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const meta = STATUS_META[status];
  return <StatusBadge label={meta.label} tone={meta.tone} />;
}
