import type { PointTransactionType } from "@/types/point";

type PointBadgeProps = {
  type: PointTransactionType;
  points: number;
};

const labelByType: Record<PointTransactionType, string> = {
  earn: "Earn",
  redeem: "Redeem",
  adjustment: "Adjustment",
};

const colorByType: Record<PointTransactionType, string> = {
  earn: "bg-green-100 text-green-800",
  redeem: "bg-amber-100 text-amber-800",
  adjustment: "bg-slate-100 text-slate-800",
};

const formatPoints = (points: number) => (points > 0 ? `+${points}` : `${points}`);

export default function PointBadge({ type, points }: PointBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorByType[type]}`}>
        {labelByType[type]}
      </span>
      <span className="text-sm font-semibold text-slate-900">{formatPoints(points)}</span>
    </div>
  );
}
