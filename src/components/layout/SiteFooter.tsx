import Link from "next/link";

import BrandLogo from "@/components/brand/BrandLogo";
import { AUTH_ROUTES, MARKETING_ROUTES } from "@/lib/constants/routes";

const LINKS = [
  { href: MARKETING_ROUTES.SERVICES, label: "Services" },
  { href: MARKETING_ROUTES.UPDATES, label: "Updates" },
  { href: MARKETING_ROUTES.CONTACT, label: "Contact" },
] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6 lg:px-8">
        <section className="space-y-3">
          <Link className="block w-[240px]" href={MARKETING_ROUTES.HOME}>
            <BrandLogo className="max-h-16 object-contain" />
            <span className="sr-only">One Dental home</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Modern dental care for families, powered by a patient-friendly digital experience.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Quick links</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link className="transition hover:text-foreground" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Contact</h2>
          <p className="text-sm text-muted-foreground">support@onedental.com</p>
          <p className="text-sm text-muted-foreground">(555) 123-4567</p>
          <div className="pt-1">
            <Link
              className="inline-flex rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              href={AUTH_ROUTES.PATIENT_LOGIN}
            >
              Patient Portal
            </Link>
          </div>
        </section>
      </div>
    </footer>
  );
}
