"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { createAppointment } from "@/features/appointments/actions/createAppointment";
import {
  INITIAL_APPOINTMENT_FORM_STATE,
  type AppointmentFormState,
  type AppointmentServiceOption,
  type AppointmentSlotOption,
} from "@/features/appointments/types";

import Button from "@/components/ui/button";
import Card, { CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

type AppointmentFormProps = {
  services: (AppointmentServiceOption & { priceLabel?: string })[];
  slots: AppointmentSlotOption[];
  initialContact?: {
    fullName: string;
    email: string;
    phone: string;
  } | null;
};

const NO_SLOT_VALUE = "no-slot";

export default function AppointmentForm({
  services,
  slots,
  initialContact,
}: AppointmentFormProps) {
  const [state, formAction, isPending] = useActionState<
    AppointmentFormState,
    FormData
  >(createAppointment, INITIAL_APPOINTMENT_FORM_STATE);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState(NO_SLOT_VALUE);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const showErrorBanner = state.status === "error" && state.message;
  const showSuccess = state.status === "success";
  return (
    <div className="space-y-5">
      {showSuccess ? (
        <section className="rounded-2xl border border-success-strong/20 bg-success-soft p-5">
          <h3 className="text-lg font-semibold text-success-strong">Appointment request received</h3>
          <p className="mt-2 text-sm text-foreground">
            {state.message ??
              "Your booking details were submitted successfully. Our clinic team will confirm your schedule soon."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="primary">
              <Link href="/patient/appointments">View my appointments</Link>
            </Button>
            {state.appointmentId ? (
              <Button asChild variant="outline">
                <Link href={`/patient/appointments/${state.appointmentId}`}>View booking details</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href="/">Return home</Link>
            </Button>
          </div>
        </section>
      ) : null}

      {showErrorBanner ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-destructive/30 bg-destructive-soft px-4 py-3 text-sm text-destructive"
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      {!showSuccess ? (
        <form action={formAction} className="space-y-5">
          <fieldset className="space-y-5" disabled={isPending}>
            <Card>
              <CardContent className="space-y-4 p-4 sm:p-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground">1) Patient details</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Confirm your contact details so we can reach you after submission.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="fullName">Name</Label>
                    <Input
                      autoComplete="name"
                      defaultValue={initialContact?.fullName ?? ""}
                      id="fullName"
                      name="fullName"
                      placeholder="Juan Dela Cruz"
                      required
                    />
                    {state.errors?.fullName?.[0] ? (
                      <p className="text-sm text-destructive">{state.errors.fullName[0]}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      autoComplete="email"
                      defaultValue={initialContact?.email ?? ""}
                      id="email"
                      name="email"
                      placeholder="name@email.com"
                      required
                      type="email"
                    />
                    {state.errors?.email?.[0] ? (
                      <p className="text-sm text-destructive">{state.errors.email[0]}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      autoComplete="tel"
                      defaultValue={initialContact?.phone ?? ""}
                      id="phone"
                      name="phone"
                      placeholder="(555) 123-4567"
                      required
                      type="tel"
                    />
                    {state.errors?.phone?.[0] ? (
                      <p className="text-sm text-destructive">{state.errors.phone[0]}</p>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-4 sm:p-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground">2) Choose service and schedule</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose from the current One Dental service list.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceId">Service</Label>
                  <input name="serviceId" type="hidden" value={selectedServiceId} />
                  <Select onValueChange={setSelectedServiceId} value={selectedServiceId || undefined}>
                    <SelectTrigger id="serviceId">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} ({service.durationMinutes} mins
                          {service.priceLabel ? ` · ${service.priceLabel}` : ""})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {state.errors?.serviceId?.[0] ? (
                    <p className="text-sm text-destructive">{state.errors.serviceId[0]}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slotId">Available slot (optional)</Label>
                  <input
                    name="slotId"
                    type="hidden"
                    value={selectedSlotId === NO_SLOT_VALUE ? "" : selectedSlotId}
                  />
                  <Select
                    onValueChange={(value) => {
                      setSelectedSlotId(value);

                      const slot = slots.find((item) => item.id === value);
                      if (slot) {
                        setAppointmentDate(slot.slotDate);
                        setAppointmentTime(slot.startTime.slice(0, 5));
                      }
                    }}
                    value={selectedSlotId}
                  >
                    <SelectTrigger id="slotId">
                      <SelectValue placeholder="No pre-defined slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_SLOT_VALUE}>No pre-defined slot</SelectItem>
                      {slots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.id}>
                          {slot.slotDate} | {slot.startTime}-{slot.endTime} ({slot.bookedCount}/
                          {slot.maxCapacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Selecting a slot auto-fills date/time. You can also set your preferred date and
                    time manually.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Preferred date</Label>
                    <Input
                      onChange={(event) => setAppointmentDate(event.target.value)}
                      value={appointmentDate}
                      id="appointmentDate"
                      name="appointmentDate"
                      type="date"
                    />
                    {state.errors?.appointmentDate?.[0] ? (
                      <p className="text-sm text-destructive">{state.errors.appointmentDate[0]}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointmentTime">Preferred time</Label>
                    <Input
                      onChange={(event) => setAppointmentTime(event.target.value)}
                      value={appointmentTime}
                      id="appointmentTime"
                      name="appointmentTime"
                      type="time"
                    />
                    {state.errors?.appointmentTime?.[0] ? (
                      <p className="text-sm text-destructive">{state.errors.appointmentTime[0]}</p>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-4 sm:p-5">
                <h3 className="text-base font-semibold text-foreground">3) Notes</h3>

                <div className="space-y-2">
                  <Label htmlFor="reason">Notes or reason for visit</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Tell us what you need help with."
                    rows={4}
                  />
                  {state.errors?.reason?.[0] ? (
                    <p className="text-sm text-destructive">{state.errors.reason[0]}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </fieldset>

          <Button className="w-full" disabled={isPending} size="lg" type="submit" variant="accent">
            {isPending ? "Submitting your request..." : "Submit booking request"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
