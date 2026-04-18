import { NOTIFICATION_TYPE, type NotificationType } from "@/lib/constants/notification-type";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import type {
  CreateNotificationInput,
  UpdateNotificationPreferencesInput,
} from "../schemas/notification.schema";
import type { NotificationActionResult } from "../types";
import { queueNotificationEmail } from "./email.service";

type NotificationPreferencesRow =
  Database["public"]["Tables"]["notification_preferences"]["Row"];

type AuthContext = {
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  profile: Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "email" | "role">;
};

type AppointmentNotificationInput = {
  recipientProfileId: string;
  appointmentId: string;
  appointmentDate: string;
  startTime: string;
};

type PointsEarnedNotificationInput = {
  recipientProfileId: string;
  points: number;
  appointmentId?: string | null;
};

type PostPublishedNotificationInput = {
  recipientProfileId: string;
  postId: string;
  title: string;
};

const defaultPreferences = {
  in_app_enabled: true,
  email_enabled: true,
  appointment_updates_enabled: true,
  points_updates_enabled: true,
  marketing_updates_enabled: false,
} as const;

async function getAuthContext(): Promise<
  | {
      ok: true;
      data: AuthContext;
    }
  | {
      ok: false;
      message: string;
    }
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      message: "You are not authorized.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      ok: false,
      message: "Unable to resolve your profile.",
    };
  }

  return {
    ok: true,
    data: {
      supabase,
      profile,
    },
  };
}

async function getProfileEmailById(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  profileId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", profileId)
    .maybeSingle();

  if (error || !data?.email) {
    return null;
  }

  return data.email;
}

async function getOrCreatePreferences(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  profileId: string,
): Promise<
  | {
      ok: true;
      data: NotificationPreferencesRow;
    }
  | {
      ok: false;
    }
> {
  const { data: existing, error: getError } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (getError) {
    return {
      ok: false,
    };
  }

  if (existing) {
    return {
      ok: true,
      data: existing,
    };
  }

  const { data: created, error: insertError } = await supabase
    .from("notification_preferences")
    .insert({
      profile_id: profileId,
      ...defaultPreferences,
    })
    .select("*")
    .single();

  if (insertError || !created) {
    return {
      ok: false,
    };
  }

  return {
    ok: true,
    data: created,
  };
}

function isEventEnabled(
  type: NotificationType | string,
  preferences: NotificationPreferencesRow,
) {
  switch (type) {
    case NOTIFICATION_TYPE.APPOINTMENT_CREATED:
    case NOTIFICATION_TYPE.APPOINTMENT_APPROVED:
    case NOTIFICATION_TYPE.APPOINTMENT_RESCHEDULED:
    case NOTIFICATION_TYPE.APPOINTMENT_CANCELLED:
    case NOTIFICATION_TYPE.APPOINTMENT_COMPLETED:
      return preferences.appointment_updates_enabled;
    case NOTIFICATION_TYPE.POINTS_EARNED:
    case NOTIFICATION_TYPE.POINTS_REDEEMED:
      return preferences.points_updates_enabled;
    case NOTIFICATION_TYPE.POST_PUBLISHED:
    case NOTIFICATION_TYPE.MARKETING_UPDATE:
      return preferences.marketing_updates_enabled;
    default:
      return true;
  }
}

export async function createInAppNotification(
  input: CreateNotificationInput,
): Promise<NotificationActionResult> {
  const supabase = await createServerSupabaseClient();

  const preferencesResult = await getOrCreatePreferences(
    supabase,
    input.recipientProfileId,
  );

  if (!preferencesResult.ok) {
    return {
      ok: false,
      message: "Unable to load notification preferences.",
    };
  }

  const preferences = preferencesResult.data;

  if (!isEventEnabled(input.type, preferences)) {
    return { ok: true };
  }

  let notificationId: string | null = null;

  if (preferences.in_app_enabled) {
    const { data: inserted, error } = await supabase
      .from("notifications")
      .insert({
        recipient_profile_id: input.recipientProfileId,
        type: input.type,
        title: input.title,
        message: input.message,
        entity_type: input.entityType ?? null,
        entity_id: input.entityId ?? null,
      })
      .select("id")
      .single();

    if (error) {
      return {
        ok: false,
        message: "Unable to create notification.",
      };
    }

    notificationId = inserted.id;
  }

  if (preferences.email_enabled) {
    const recipientEmail = await getProfileEmailById(
      supabase,
      input.recipientProfileId,
    );

    if (recipientEmail) {
      await queueNotificationEmail(supabase, {
        profileId: input.recipientProfileId,
        notificationId,
        emailTo: recipientEmail,
        subject: input.title,
        templateKey: input.type,
      });
    }
  }

  return { ok: true };
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<NotificationActionResult> {
  const authResult = await getAuthContext();
  if (!authResult.ok) {
    return authResult;
  }

  const { supabase, profile } = authResult.data;

  const { data, error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("recipient_profile_id", profile.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      message: "Unable to mark notification as read.",
    };
  }

  if (!data) {
    return {
      ok: false,
      message: "Notification not found.",
    };
  }

  return { ok: true };
}

export async function markAllNotificationsAsRead(): Promise<NotificationActionResult> {
  const authResult = await getAuthContext();
  if (!authResult.ok) {
    return authResult;
  }

  const { supabase, profile } = authResult.data;
  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("recipient_profile_id", profile.id)
    .eq("is_read", false);

  if (error) {
    return {
      ok: false,
      message: "Unable to mark all notifications as read.",
    };
  }

  return { ok: true };
}

export async function updateMyNotificationPreferences(
  input: UpdateNotificationPreferencesInput,
): Promise<NotificationActionResult> {
  const authResult = await getAuthContext();
  if (!authResult.ok) {
    return authResult;
  }

  const { supabase, profile } = authResult.data;
  const { error } = await supabase.from("notification_preferences").upsert(
    {
      profile_id: profile.id,
      in_app_enabled: input.inAppEnabled,
      email_enabled: input.emailEnabled,
      appointment_updates_enabled: input.appointmentUpdatesEnabled,
      points_updates_enabled: input.pointsUpdatesEnabled,
      marketing_updates_enabled: input.marketingUpdatesEnabled,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "profile_id" },
  );

  if (error) {
    return {
      ok: false,
      message: "Unable to update notification preferences.",
    };
  }

  return { ok: true };
}

function buildAppointmentMessage(input: {
  appointmentDate: string;
  startTime: string;
}) {
  return `Appointment on ${input.appointmentDate} at ${input.startTime}`;
}

export async function notifyAppointmentCreated(
  input: AppointmentNotificationInput,
): Promise<NotificationActionResult> {
  return createInAppNotification({
    recipientProfileId: input.recipientProfileId,
    type: NOTIFICATION_TYPE.APPOINTMENT_CREATED,
    title: "Appointment created",
    message: buildAppointmentMessage(input),
    entityType: "appointment",
    entityId: input.appointmentId,
  });
}

export async function notifyAppointmentApproved(
  input: AppointmentNotificationInput,
): Promise<NotificationActionResult> {
  return createInAppNotification({
    recipientProfileId: input.recipientProfileId,
    type: NOTIFICATION_TYPE.APPOINTMENT_APPROVED,
    title: "Appointment approved",
    message: buildAppointmentMessage(input),
    entityType: "appointment",
    entityId: input.appointmentId,
  });
}

export async function notifyAppointmentRescheduled(
  input: AppointmentNotificationInput,
): Promise<NotificationActionResult> {
  return createInAppNotification({
    recipientProfileId: input.recipientProfileId,
    type: NOTIFICATION_TYPE.APPOINTMENT_RESCHEDULED,
    title: "Appointment rescheduled",
    message: buildAppointmentMessage(input),
    entityType: "appointment",
    entityId: input.appointmentId,
  });
}

export async function notifyAppointmentCancelled(
  input: AppointmentNotificationInput,
): Promise<NotificationActionResult> {
  return createInAppNotification({
    recipientProfileId: input.recipientProfileId,
    type: NOTIFICATION_TYPE.APPOINTMENT_CANCELLED,
    title: "Appointment cancelled",
    message: buildAppointmentMessage(input),
    entityType: "appointment",
    entityId: input.appointmentId,
  });
}

export async function notifyAppointmentCompleted(
  input: AppointmentNotificationInput,
): Promise<NotificationActionResult> {
  return createInAppNotification({
    recipientProfileId: input.recipientProfileId,
    type: NOTIFICATION_TYPE.APPOINTMENT_COMPLETED,
    title: "Appointment completed",
    message: buildAppointmentMessage(input),
    entityType: "appointment",
    entityId: input.appointmentId,
  });
}

export async function notifyPointsEarned(
  input: PointsEarnedNotificationInput,
): Promise<NotificationActionResult> {
  return createInAppNotification({
    recipientProfileId: input.recipientProfileId,
    type: NOTIFICATION_TYPE.POINTS_EARNED,
    title: "Points earned",
    message: `You earned ${input.points} points.`,
    entityType: input.appointmentId ? "appointment" : undefined,
    entityId: input.appointmentId ?? undefined,
  });
}

export async function notifyPostPublished(
  input: PostPublishedNotificationInput,
): Promise<NotificationActionResult> {
  return createInAppNotification({
    recipientProfileId: input.recipientProfileId,
    type: NOTIFICATION_TYPE.POST_PUBLISHED,
    title: "New clinic update",
    message: input.title,
    entityType: "post",
    entityId: input.postId,
  });
}
