import Link from "next/link";

import BrandLogo from "@/components/brand/BrandLogo";
import { AUTH_ROUTES, MARKETING_ROUTES } from "@/lib/constants/routes";

const NAV_ITEMS = [
  { href: MARKETING_ROUTES.SERVICES, label: "Services" },
  { href: MARKETING_ROUTES.UPDATES, label: "Updates" },
  { href: MARKETING_ROUTES.CONTACT, label: "Contact" },
] as const;

export default function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
        <Link className="block w-[150px] sm:w-[220px] md:w-[230px]" href={MARKETING_ROUTES.HOME}>
          <BrandLogo className="max-h-14 object-contain" priority />
          <span className="sr-only">One Dental home</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            href={AUTH_ROUTES.PATIENT_LOGIN}
          >
            Patient Login
          </Link>
          <Link
            className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
            href={MARKETING_ROUTES.BOOK_APPOINTMENT}
          >
            Book Appointment
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary className="flex h-10 list-none items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-foreground transition hover:bg-muted [&::-webkit-details-marker]:hidden">
            <svg aria-hidden="true" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            </svg>
            Menu
          </summary>

          <div className="absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-border bg-card p-3 shadow-sm">
            <nav className="grid gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 grid gap-2 border-t border-border pt-3">
              <Link
                className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-foreground transition hover:bg-muted"
                href={AUTH_ROUTES.PATIENT_LOGIN}
              >
                Patient Login
              </Link>
              <Link
                className="rounded-lg bg-accent px-3 py-2 text-center text-sm font-semibold text-accent-foreground transition hover:brightness-95"
                href={MARKETING_ROUTES.BOOK_APPOINTMENT}
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
