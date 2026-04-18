import AdminLoginForm from "@/components/auth/AdminLoginForm";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-12">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin login</h1>
        <p className="mt-1 text-sm text-slate-600">Use your admin email and password.</p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
