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
import {
  CLINIC_PHONE_HREF,
  MAPS_OPEN_URL,
  MESSENGER_URL,
} from "@/lib/constants/clinic";
import { MARKETING_ROUTES } from "@/lib/constants/routes";

type IconKey =
  | "home"
  | "about"
  | "services"
  | "contact"
  | "calendar"
  | "chat"
  | "phone"
  | "map";

const NAV_ITEMS = [
  { href: MARKETING_ROUTES.HOME, label: "Home", icon: "home" },
  { href: MARKETING_ROUTES.ABOUT, label: "About", icon: "about" },
  { href: MARKETING_ROUTES.SERVICES, label: "Services", icon: "services" },
  { href: MARKETING_ROUTES.CONTACT, label: "Contact", icon: "contact" },
  {
    href: MARKETING_ROUTES.BOOK_APPOINTMENT,
    label: "Book Appointment",
    icon: "calendar",
  },
] as const;

const QUICK_ACTIONS = [
  {
    href: MESSENGER_URL,
    label: "Chat via Messenger",
    icon: "chat",
    external: true,
  },
  {
    href: CLINIC_PHONE_HREF,
    label: "Call clinic",
    icon: "phone",
    external: false,
  },
  {
    href: MAPS_OPEN_URL,
    label: "Open map",
    icon: "map",
    external: true,
  },
] as const;

function NavIcon({ icon }: { icon: IconKey }) {
  if (icon === "calendar") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M7 3v3m10-3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (icon === "services") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M6 5h12M6 12h12M6 19h12M4 5h.01M4 12h.01M4 19h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.9"
        />
      </svg>
    );
  }

  if (icon === "about") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (icon === "contact" || icon === "map") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 21s7-4.7 7-11a7 7 0 1 0-14 0c0 6.3 7 11 7 11Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M12 10.5h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    );
  }

  if (icon === "chat") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M5 18.5V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9l-4 2.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M9 9h6M9 12h4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (icon === "phone") {
    return (
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M7.5 4.5 10 9l-2 1.5c1.2 2.4 3.1 4.3 5.5 5.5l1.5-2 4.5 2.5c-.5 2.1-2.2 3.5-4.4 3.5C9 20 4 15 4 8.9c0-2.2 1.4-3.9 3.5-4.4Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="m4 11 8-7 8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function isPathActive(pathname: string, href: string) {
  return href === MARKETING_ROUTES.HOME
    ? pathname === href
    : pathname.startsWith(href);
}

export default function MobileNavSheet() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="marketing-button-hover min-w-[88px]" size="sm" variant="outline">
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.7"
            />
          </svg>
          Menu
        </Button>
      </SheetTrigger>

      <SheetContent
        className="flex h-full w-[min(90vw,28rem)] max-w-sm flex-col overflow-hidden rounded-l-[1.7rem] border-l border-border/80 bg-card/98 p-0 shadow-[0_24px_70px_-32px_hsl(var(--shadow))] backdrop-blur-xl"
        showClose={false}
        side="right"
      >
        <SheetHeader className="border-b border-border/80 px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-3">
            <Link className="block w-[166px]" href={MARKETING_ROUTES.HOME}>
              <BrandLogo className="max-h-12 object-contain" priority />
              <span className="sr-only">One Dental home</span>
            </Link>

            <SheetClose
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              type="button"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 6l12 12M6 18 18 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
              <span className="sr-only">Close navigation</span>
            </SheetClose>
          </div>

          <SheetTitle className="sr-only">One Dental navigation</SheetTitle>
          <SheetDescription className="pt-1 text-sm text-muted-foreground">
            Book visits and explore services
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Navigation
          </p>

          <nav className="mt-2 grid gap-3">
            {NAV_ITEMS.map((item) => {
              const active = isPathActive(pathname, item.href);

              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    className={`flex min-h-14 items-center gap-3 rounded-2xl border px-3.5 py-3 transition ${
                      active
                        ? "border-primary/20 bg-primary/12 text-primary shadow-sm"
                        : "border-border/70 bg-background/70 text-foreground hover:border-primary/25 hover:bg-primary/8"
                    }`}
                    href={item.href}
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
                      <NavIcon icon={item.icon} />
                    </span>

                    <span className="min-w-0 flex-1 text-base font-semibold leading-none">
                      {item.label}
                    </span>

                    <span className="shrink-0 text-muted-foreground">
                      <ChevronIcon />
                    </span>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          <p className="mt-6 px-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            Quick actions
          </p>

          <div className="mt-2 grid gap-3">
            {QUICK_ACTIONS.map((item) => (
              <SheetClose asChild key={item.label}>
                <a
                  className="flex min-h-[3.25rem] items-center gap-3 rounded-2xl border border-border/70 bg-card-strong px-3.5 py-3 text-foreground transition hover:border-primary/25 hover:bg-primary/8"
                  href={item.href}
                  rel={item.external ? "noreferrer" : undefined}
                  target={item.external ? "_blank" : undefined}
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                    <NavIcon icon={item.icon} />
                  </span>

                  <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">
                    {item.label}
                  </span>

                  <span className="shrink-0 text-muted-foreground">
                    <ChevronIcon />
                  </span>
                </a>
              </SheetClose>
            ))}
          </div>
        </div>

        <div className="border-t border-border/80 bg-background/80 p-4">
          <div className="grid gap-2">
            <SheetClose asChild>
              <Button
                asChild
                className="marketing-button-hover w-full rounded-2xl"
                size="lg"
                variant="accent"
              >
                <Link href={MARKETING_ROUTES.BOOK_APPOINTMENT}>
                  <NavIcon icon="calendar" />
                  Book Appointment
                </Link>
              </Button>
            </SheetClose>

            <SheetClose asChild>
              <Button
                asChild
                className="marketing-button-hover w-full rounded-2xl"
                size="lg"
                variant="outline"
              >
                <a href={MESSENGER_URL} rel="noreferrer" target="_blank">
                  <NavIcon icon="chat" />
                  Chat on Messenger
                </a>
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}