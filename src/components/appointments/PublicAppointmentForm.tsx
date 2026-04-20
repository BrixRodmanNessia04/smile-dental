"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Textarea from "@/components/ui/textarea";
import {
  INITIAL_PUBLIC_APPOINTMENT_FORM_STATE,
  submitPublicAppointmentRequest,
  type PublicAppointmentFormState,
} from "@/features/appointments/actions/submitPublicAppointmentRequest";
import type { StaticAppointmentServiceOption } from "@/lib/constants/services";

type PublicAppointmentFormProps = {
  services: StaticAppointmentServiceOption[];
};

export default function PublicAppointmentForm({
  services,
}: PublicAppointmentFormProps) {
  const [state, formAction, isPending] = useActionState<
    PublicAppointmentFormState,
    FormData
  >(submitPublicAppointmentRequest, INITIAL_PUBLIC_APPOINTMENT_FORM_STATE);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [serviceQuery, setServiceQuery] = useState("");
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const serviceMenuRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const filteredServices = useMemo(() => {
    const query = serviceQuery.trim().toLowerCase();
    if (!query) {
      return services;
    }

    return services.filter((service) =>
      service.name.toLowerCase().includes(query),
    );
  }, [serviceQuery, services]);
  const selectedServiceNames = useMemo(() => {
    const selected = new Set(selectedServiceIds);
    return services
      .filter((service) => selected.has(service.id))
      .map((service) => service.name);
  }, [selectedServiceIds, services]);
  const showError = state.status === "error" && state.message;
  const showSuccess = state.status === "success";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        serviceMenuRef.current &&
        !serviceMenuRef.current.contains(event.target as Node)
      ) {
        setIsServiceMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((previous) => {
      if (previous.includes(serviceId)) {
        return previous.filter((item) => item !== serviceId);
      }

      return [...previous, serviceId];
    });
  };

  return (
    <div className="space-y-5">
      {showSuccess ? (
        <section
          aria-live="polite"
          className="rounded-2xl border border-success-strong/20 bg-success-soft p-5"
          role="status"
        >
          <h2 className="text-xl font-semibold text-success-strong">
            Appointment request sent
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {state.message}
          </p>
        </section>
      ) : null}

      {showError ? (
        <p
          aria-live="polite"
          className="rounded-xl border border-destructive/30 bg-destructive-soft px-4 py-3 text-sm text-destructive"
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      {!showSuccess ? (
        <form action={formAction} className="space-y-5">
          <fieldset
            className="grid gap-4 sm:grid-cols-2"
            disabled={isPending}
          >
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                autoComplete="name"
                id="fullName"
                name="fullName"
                placeholder="Juan Dela Cruz"
                required
              />
              {state.errors?.fullName?.[0] ? (
                <p className="text-sm text-destructive">
                  {state.errors.fullName[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                autoComplete="email"
                id="email"
                name="email"
                placeholder="name@email.com"
                required
                type="email"
              />
              {state.errors?.email?.[0] ? (
                <p className="text-sm text-destructive">
                  {state.errors.email[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                autoComplete="tel"
                id="phone"
                name="phone"
                placeholder="(555) 123-4567"
                required
                type="tel"
              />
              {state.errors?.phone?.[0] ? (
                <p className="text-sm text-destructive">
                  {state.errors.phone[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="serviceSearch">Services</Label>
              <input
                name="serviceIds"
                type="hidden"
                value={selectedServiceIds.join(",")}
              />
              <div className="relative" ref={serviceMenuRef}>
                <button
                  aria-controls="serviceDropdown"
                  aria-expanded={isServiceMenuOpen}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-left text-base text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                  onClick={() => setIsServiceMenuOpen((previous) => !previous)}
                  type="button"
                >
                  <span className="truncate text-sm">
                    {selectedServiceNames.length > 0
                      ? `${selectedServiceNames.length} service${
                          selectedServiceNames.length > 1 ? "s" : ""
                        } selected`
                      : "Select one or more services"}
                  </span>
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                    />
                  </svg>
                </button>

                {isServiceMenuOpen ? (
                  <div
                    className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-card p-2 shadow-lg"
                    id="serviceDropdown"
                  >
                    <Input
                      id="serviceSearch"
                      onChange={(event) => setServiceQuery(event.target.value)}
                      placeholder="Search services..."
                      type="text"
                      value={serviceQuery}
                    />
                    <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
                      {filteredServices.length > 0 ? (
                        filteredServices.map((service) => {
                          const isChecked = selectedServiceIds.includes(
                            service.id,
                          );

                          return (
                            <button
                              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground transition hover:bg-muted"
                              key={service.id}
                              onClick={() => toggleService(service.id)}
                              type="button"
                            >
                              <span
                                className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                  isChecked
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-input bg-background text-transparent"
                                }`}
                              >
                                <svg
                                  aria-hidden="true"
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="m5 12 5 5L20 7"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                  />
                                </svg>
                              </span>
                              <span>{service.name}</span>
                            </button>
                          );
                        })
                      ) : (
                        <p className="px-2 py-2 text-sm text-muted-foreground">
                          No services found.
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {selectedServiceNames.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedServiceNames.map((serviceName) => (
                    <span
                      className="rounded-full border border-border bg-card-strong px-2.5 py-1 text-xs text-foreground"
                      key={serviceName}
                    >
                      {serviceName}
                    </span>
                  ))}
                </div>
              ) : null}

              {state.errors?.serviceIds?.[0] ? (
                <p className="text-sm text-destructive">
                  {state.errors.serviceIds[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input
                id="preferredDate"
                min={today}
                name="preferredDate"
                required
                type="date"
              />
              {state.errors?.preferredDate?.[0] ? (
                <p className="text-sm text-destructive">
                  {state.errors.preferredDate[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime">Preferred Time</Label>
              <Input
                id="preferredTime"
                name="preferredTime"
                required
                type="time"
              />
              {state.errors?.preferredTime?.[0] ? (
                <p className="text-sm text-destructive">
                  {state.errors.preferredTime[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes / Reason for Visit</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Tell us what you need help with or share any scheduling preferences."
                rows={5}
              />
              {state.errors?.notes?.[0] ? (
                <p className="text-sm text-destructive">
                  {state.errors.notes[0]}
                </p>
              ) : null}
            </div>
          </fieldset>

          <Button
            className="marketing-button-hover w-full"
            disabled={isPending}
            size="lg"
            type="submit"
            variant="accent"
          >
            {isPending ? "Sending request..." : "Submit appointment request"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
