import Link from "next/link";

// import OAuthButtons from "@/components/auth/OAuthButtons";
import PatientLoginForm from "@/components/auth/PatientLoginForm";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-12">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link
          className="inline-flex items-center text-sm font-medium text-slate-700 underline hover:text-slate-900"
          href={MARKETING_ROUTES.HOME}
        >
          Back to Home
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Patient login</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to manage appointments and your profile.</p>
        <div className="mt-6 space-y-6">
          <PatientLoginForm />
          {/* <OAuthButtons /> */}
        </div>
      </section>
    </main>
  );
}
