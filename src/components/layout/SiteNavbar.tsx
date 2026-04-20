"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import BrandLogo from "@/components/brand/BrandLogo";
import MobileNavSheet from "@/components/layout/MobileNavSheet";
import Button from "@/components/ui/button";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

const NAV_ITEMS = [
  { href: MARKETING_ROUTES.HOME, label: "Home" },
  { href: MARKETING_ROUTES.ABOUT, label: "About" },
  { href: MARKETING_ROUTES.SERVICES, label: "Services" },
  { href: MARKETING_ROUTES.CONTACT, label: "Contact" },
] as const;

export default function SiteNavbar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === MARKETING_ROUTES.HOME ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 shadow-[0_10px_32px_-28px_hsl(var(--shadow))] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
        <Link className="block w-[158px] sm:w-[214px] md:w-[222px]" href={MARKETING_ROUTES.HOME}>
          <BrandLogo className="max-h-12 object-contain sm:max-h-14" priority />
          <span className="sr-only">One Dental home</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/75 p-1.5 shadow-sm backdrop-blur md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary ${
                isActive(item.href) ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/90"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Button asChild className="marketing-button-hover" variant="accent">
            <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>Book Appointment</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <MobileNavSheet />
        </div>
      </div>
    </header>
  );
}
