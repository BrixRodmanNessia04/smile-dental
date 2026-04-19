"use client";

import Link from "next/link";

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
  { href: MARKETING_ROUTES.SERVICES, label: "Services" },
  { href: MARKETING_ROUTES.ABOUT, label: "About" },
  { href: MARKETING_ROUTES.CONTACT, label: "Contact" },
] as const;

export default function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
        <Link className="block w-[160px] sm:w-[220px] md:w-[230px]" href={MARKETING_ROUTES.HOME}>
          <BrandLogo className="max-h-14 object-contain" priority />
          <span className="sr-only">One Dental home</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              className="text-sm font-medium text-foreground/90 transition hover:text-primary"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Button asChild variant="accent">
            <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>Book Appointment</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline">
                <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
                </svg>
                Menu
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>One Dental</SheetTitle>
                <SheetDescription>Browse our pages and book your appointment quickly.</SheetDescription>
              </SheetHeader>

              <nav className="mt-5 grid gap-1">
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition hover:bg-muted"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-4 border-t border-border pt-4">
                <SheetClose asChild>
                  <Button asChild className="w-full" variant="accent">
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
