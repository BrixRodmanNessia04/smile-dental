import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Notification, NotificationPreference } from "@/types/notification";

import type { NotificationsPayload } from "../types";

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
type NotificationPreferenceRow =
  Database["public"]["Tables"]["notification_preferences"]["Row"];

const mapNotification = (row: NotificationRow): Notification => ({
  id: row.id,
  recipientProfileId: row.recipient_profile_id,
  type: row.type,
  title: row.title,
  message: row.message,
  entityType: row.entity_type,
  entityId: row.entity_id,
  isRead: row.is_read,
  readAt: row.read_at,
  createdAt: row.created_at,
});

const mapPreferences = (row: NotificationPreferenceRow): NotificationPreference => ({
  id: row.id,
  profileId: row.profile_id,
  inAppEnabled: row.in_app_enabled,
  emailEnabled: row.email_enabled,
  appointmentUpdatesEnabled: row.appointment_updates_enabled,
  pointsUpdatesEnabled: row.points_updates_enabled,
  marketingUpdatesEnabled: row.marketing_updates_enabled,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const defaultPreferences = (profileId: string): NotificationPreference => {
  const epoch = new Date(0).toISOString();
  return {
    id: "",
    profileId,
    inAppEnabled: true,
    emailEnabled: true,
    appointmentUpdatesEnabled: true,
    pointsUpdatesEnabled: true,
    marketingUpdatesEnabled: false,
    createdAt: epoch,
    updatedAt: epoch,
  };
};

async function getAuthContext() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false as const,
      message: "You are not authorized.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      ok: false as const,
      message: "Unable to resolve your profile.",
    };
  }

  return {
    ok: true as const,
    data: { supabase, profileId: profile.id },
  };
}

export async function getMyNotificationsPayload(
  limit = 20,
): Promise<
  | {
      ok: true;
      data: NotificationsPayload;
    }
  | {
      ok: false;
      message: string;
    }
> {
  const authResult = await getAuthContext();
  if (!authResult.ok) {
    return authResult;
  }

  const { supabase, profileId } = authResult.data;

  const [
    { data: notifications, error: notificationsError },
    { data: preferences },
    { count, error: unreadCountError },
  ] = await Promise.all([
    supabase
      .from("notifications")
      .select("*")
      .eq("recipient_profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("notification_preferences")
      .select("*")
      .eq("profile_id", profileId)
      .maybeSingle(),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("recipient_profile_id", profileId)
      .eq("is_read", false),
  ]);

  if (notificationsError || unreadCountError) {
    return {
      ok: false,
      message: "Unable to load notifications.",
    };
  }

  return {
    ok: true,
    data: {
      notifications: (notifications ?? []).map(mapNotification),
      unreadCount: count ?? 0,
      preferences: preferences
        ? mapPreferences(preferences)
        : defaultPreferences(profileId),
    },
  };
}
