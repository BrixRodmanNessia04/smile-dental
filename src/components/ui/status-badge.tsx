import Badge from "./badge";

type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
};

export default function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return <Badge variant={tone}>{label}</Badge>;
}
