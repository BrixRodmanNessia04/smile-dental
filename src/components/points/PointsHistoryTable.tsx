import type { PointsTransaction } from "@/features/points/types";

import PointBadge from "./PointBadge";

type PointsHistoryTableProps = {
  transactions: PointsTransaction[];
  emptyMessage?: string;
  showPatient?: boolean;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function PointsHistoryTable({
  transactions,
  emptyMessage = "No point transactions yet.",
  showPatient = false,
}: PointsHistoryTableProps) {
  if (transactions.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-slate-700">
            <th className="px-4 py-3 font-semibold">Date</th>
            {showPatient ? <th className="px-4 py-3 font-semibold">Patient</th> : null}
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-4 py-3 text-slate-700">{formatDate(transaction.createdAt)}</td>
              {showPatient ? (
                <td className="px-4 py-3 text-slate-700">
                  {transaction.patientName ?? transaction.patientProfileId}
                </td>
              ) : null}
              <td className="px-4 py-3">
                <PointBadge points={transaction.points} type={transaction.type} />
              </td>
              <td className="px-4 py-3 text-slate-700">
                {transaction.description || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
