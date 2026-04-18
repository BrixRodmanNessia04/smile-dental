import AdminGrantPointsForm from "@/components/points/AdminGrantPointsForm";
import PointsHistoryTable from "@/components/points/PointsHistoryTable";
import { getAdminPointsPayload } from "@/features/points/services/points-query.service";

export default async function Page() {
  const result = await getAdminPointsPayload();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Points management</h1>

      {!result.ok ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {result.message}
        </p>
      ) : (
        <>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Grant points</h2>
            <p className="mt-1 text-sm text-slate-600">
              Add earned points for a patient. A points-earned notification is created.
            </p>
            <div className="mt-4">
              <AdminGrantPointsForm patients={result.data.patients} />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Recent point transactions</h2>
            <PointsHistoryTable
              emptyMessage="No point transactions yet."
              showPatient
              transactions={result.data.transactions}
            />
          </section>
        </>
      )}
    </main>
  );
}
