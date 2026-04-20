"use server";

import { getStaticAppointmentServices } from "@/lib/constants/services";

import {
  publicAppointmentRequestSchema,
  type PublicAppointmentRequestInput,
} from "../schemas/public-appointment.schema";

export type PublicAppointmentFieldErrors = {
  fullName?: string[];
  email?: string[];
  phone?: string[];
  serviceIds?: string[];
  preferredDate?: string[];
  preferredTime?: string[];
  notes?: string[];
};

export type PublicAppointmentFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: PublicAppointmentFieldErrors;
};

export const INITIAL_PUBLIC_APPOINTMENT_FORM_STATE: PublicAppointmentFormState =
  {
    status: "idle",
  };

const trimOrUndefined = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function getServiceNames(serviceIds: string[]) {
  return serviceIds.map((serviceId) => {
    return (
      getStaticAppointmentServices().find((service) => service.id === serviceId)
        ?.name ?? serviceId
    );
  });
}

function buildAppointmentEmail(input: PublicAppointmentRequestInput) {
  const serviceNames = getServiceNames(input.serviceIds);
  const servicesLabel = serviceNames.join(", ");
  const safeNotes = input.notes ?? "No notes provided.";

  const text = [
    "New One Dental appointment request",
    "",
    `Full Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Phone Number: ${input.phone}`,
    `Services: ${servicesLabel}`,
    `Preferred Date: ${input.preferredDate}`,
    `Preferred Time: ${input.preferredTime}`,
    "",
    "Notes / Reason for Visit:",
    safeNotes,
  ].join("\n");

  const htmlRows = [
    ["Full Name", input.fullName],
    ["Email", input.email],
    ["Phone Number", input.phone],
    ["Services", servicesLabel],
    ["Preferred Date", input.preferredDate],
    ["Preferred Time", input.preferredTime],
    ["Notes / Reason for Visit", safeNotes],
  ]
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #d6e1e3;font-weight:700;color:#155e63;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border:1px solid #d6e1e3;color:#213f45;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#213f45;line-height:1.5;">
      <h1 style="color:#19747b;">New One Dental appointment request</h1>
      <p>A public appointment request was submitted from the website.</p>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">${htmlRows}</table>
    </div>`;

  return {
    serviceNames,
    text,
    html,
  };
}

async function sendAppointmentRequestEmail(
  input: PublicAppointmentRequestInput,
) {
  const apiKey = trimOrUndefined(process.env.RESEND_API_KEY);
  const toEmail = trimOrUndefined(process.env.APPOINTMENT_REQUEST_TO_EMAIL);
  const fromEmail =
    trimOrUndefined(process.env.APPOINTMENT_REQUEST_FROM_EMAIL) ??
    "One Dental <appointments@onedental.com>";

  if (!apiKey || !toEmail) {
    return {
      ok: false as const,
      message:
        "Appointment email is not configured yet. Please set RESEND_API_KEY and APPOINTMENT_REQUEST_TO_EMAIL.",
    };
  }

  const email = buildAppointmentEmail(input);
  const subjectService =
    email.serviceNames.length > 1
      ? `${email.serviceNames[0]} +${email.serviceNames.length - 1} more`
      : email.serviceNames[0];
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: input.email,
      subject: `New appointment request: ${subjectService}`,
      text: email.text,
      html: email.html,
    }),
  });

  if (!response.ok) {
    return {
      ok: false as const,
      message:
        "We could not send your appointment request right now. Please try again in a few minutes.",
    };
  }

  return { ok: true as const };
}

export async function submitPublicAppointmentRequest(
  _previousState: PublicAppointmentFormState,
  formData: FormData,
): Promise<PublicAppointmentFormState> {
  const serviceIds = String(formData.get("serviceIds") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const parsed = publicAppointmentRequestSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    serviceIds,
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime"),
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await sendAppointmentRequestEmail(parsed.data);

  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
    };
  }

  return {
    status: "success",
    message:
      "Your appointment request was sent. The One Dental team will contact you to confirm your schedule.",
  };
}
