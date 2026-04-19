import Link from "next/link";

import BrandLogo from "@/components/brand/BrandLogo";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

const SERVICE_LINKS = [
  { label: "Preventive Care", href: MARKETING_ROUTES.SERVICES },
  { label: "Cosmetic Dentistry", href: MARKETING_ROUTES.SERVICES },
  { label: "Restorative Dentistry", href: MARKETING_ROUTES.SERVICES },
  { label: "Dental Implants", href: MARKETING_ROUTES.SERVICES },
] as const;

const COMPANY_LINKS = [
  { label: "Home", href: MARKETING_ROUTES.HOME },
  { label: "About", href: MARKETING_ROUTES.ABOUT },
  { label: "Services", href: MARKETING_ROUTES.SERVICES },
  { label: "Contact", href: MARKETING_ROUTES.CONTACT },
] as const;

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8 lg:px-8 lg:py-14">
        <section className="space-y-3">
          <Link className="block w-[220px]" href={MARKETING_ROUTES.HOME}>
            <BrandLogo className="max-h-16 object-contain" />
            <span className="sr-only">One Dental home</span>
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            Modern dentistry focused on comfort, technology, and exceptional patient care for every
            stage of your smile journey.
          </p>
          <p className="text-xs text-muted-foreground">
            One Dental placeholders can be updated with your final clinic details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-primary">Services</h2>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            {SERVICE_LINKS.map((item) => (
              <li key={item.label}>
                <Link className="transition hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-primary">Company</h2>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            {COMPANY_LINKS.map((item) => (
              <li key={item.label}>
                <Link className="transition hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-primary">Contact</h2>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>123 One Dental Avenue</p>
            <p>(555) 123-4567</p>
            <p>support@onedental.com</p>
          </div>
          <div className="flex items-center gap-2 pt-1 text-muted-foreground">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background">
              <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 8h2V5.5a23 23 0 0 0-3.2-.2C9.7 5.3 7.5 7.2 7.5 10.7V13H5v3h2.5v8h3v-8h2.7l.4-3h-3.1v-2c0-.9.3-1.5 1.5-1.5Z" />
              </svg>
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background">
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <rect height="14" rx="4" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="16.8" cy="7.4" fill="currentColor" r="1" />
              </svg>
            </span>
          </div>
        </section>
      </div>

      <div className="border-t border-border bg-background/30">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} One Dental. All rights reserved.</p>
          <p>Terms of Service · Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
}
