type PointsSummaryCardProps = {
  totalPoints: number;
  updatedAt?: string;
  title?: string;
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function PointsSummaryCard({
  totalPoints,
  updatedAt,
  title = "Points balance",
}: PointsSummaryCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{totalPoints}</p>
      <p className="mt-1 text-xs text-slate-500">Last updated: {formatDate(updatedAt)}</p>
    </section>
  );
}
