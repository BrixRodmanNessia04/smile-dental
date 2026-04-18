import { createAppointmentSlot } from "@/features/appointments/actions/createAppointmentSlot";
import { listAdminAppointmentSlots } from "@/features/appointments/services/appointment-query.service";

export default async function Page() {
  const slotsResult = await listAdminAppointmentSlots();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Appointment Schedule</h1>
      <p className="mt-1 text-sm text-slate-600">
        Placeholder schedule management with slot creation support.
      </p>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Create slot</h2>
        <form action={createAppointmentSlot} className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            name="slotDate"
            required
            type="date"
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            name="startTime"
            required
            type="time"
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            name="endTime"
            required
            type="time"
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
            defaultValue={1}
            max={20}
            min={1}
            name="maxCapacity"
            required
            type="number"
          />
          <button
            className="md:col-span-4 w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            type="submit"
          >
            Create slot
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Slots</h2>
        {!slotsResult.ok ? (
          <p className="mt-3 text-sm text-red-700">{slotsResult.message}</p>
        ) : slotsResult.data.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No slots yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-700">
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Time</th>
                  <th className="px-3 py-2 font-semibold">Capacity</th>
                  <th className="px-3 py-2 font-semibold">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {slotsResult.data.map((slot) => (
                  <tr key={slot.id}>
                    <td className="px-3 py-2">{slot.slotDate}</td>
                    <td className="px-3 py-2">
                      {slot.startTime}-{slot.endTime}
                    </td>
                    <td className="px-3 py-2">
                      {slot.bookedCount}/{slot.maxCapacity}
                    </td>
                    <td className="px-3 py-2">{slot.isActive ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
