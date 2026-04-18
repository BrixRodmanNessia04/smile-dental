import PointsHistoryTable from "@/components/points/PointsHistoryTable";
import PointsSummaryCard from "@/components/points/PointsSummaryCard";
import RedeemPointsPlaceholderForm from "@/components/points/RedeemPointsPlaceholderForm";
import { getPatientPointsPayload } from "@/features/points/services/points-query.service";

export default async function Page() {
  const result = await getPatientPointsPayload();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">My points</h1>

      {!result.ok ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {result.message}
        </p>
      ) : (
        <>
          <PointsSummaryCard
            title="Current balance"
            totalPoints={result.data.summary.totalPoints}
            updatedAt={result.data.summary.updatedAt}
          />

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Redeem points</h2>
            <p className="mt-1 text-sm text-slate-600">
              Redeem flow is not live yet. This is a placeholder action.
            </p>
            <div className="mt-4">
              <RedeemPointsPlaceholderForm />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Points history</h2>
            <PointsHistoryTable transactions={result.data.transactions} />
          </section>
        </>
      )}
    </main>
  );
}
