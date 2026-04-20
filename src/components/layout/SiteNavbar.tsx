"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import BrandLogo from "@/components/brand/BrandLogo";
import Button from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
        <Link className="block w-[160px] sm:w-[220px] md:w-[230px]" href={MARKETING_ROUTES.HOME}>
          <BrandLogo className="max-h-14 object-contain" priority />
          <span className="sr-only">One Dental home</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 shadow-sm md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary ${
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
          <Sheet>
            <SheetTrigger asChild>
              <Button className="marketing-button-hover min-w-[88px]" size="sm" variant="outline">
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
                </svg>
                Menu
              </Button>
            </SheetTrigger>

            <SheetContent className="flex h-full w-[min(100%-0.75rem,24rem)] flex-col p-0" side="right">
              <SheetHeader className="border-b border-border px-5 pb-4 pt-5">
                <SheetTitle>One Dental</SheetTitle>
                <SheetDescription>Browse our pages and book your appointment quickly.</SheetDescription>
              </SheetHeader>

              <nav className="grid gap-2 px-4 py-5">
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      className={`min-h-12 rounded-xl px-4 py-3.5 text-base font-medium transition duration-200 ${
                        isActive(item.href)
                          ? "bg-primary/12 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    className={`min-h-12 rounded-xl px-4 py-3.5 text-base font-medium transition duration-200 ${
                      isActive(MARKETING_ROUTES.BOOK_APPOINTMENT)
                        ? "bg-primary/12 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                    href={MARKETING_ROUTES.BOOK_APPOINTMENT}
                  >
                    Book Appointment
                  </Link>
                </SheetClose>
              </nav>

              <div className="mt-auto border-t border-border p-4">
                <SheetClose asChild>
                  <Button asChild className="marketing-button-hover w-full" size="lg" variant="accent">
                    <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>Book Appointment</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
