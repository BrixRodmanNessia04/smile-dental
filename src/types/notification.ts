import type { NotificationType } from "@/lib/constants/notification-type";

export type EmailLogStatus = "queued" | "sent" | "failed";

export type NotificationRow = {
  id: string;
  recipient_profile_id: string;
  type: NotificationType | string;
  title: string;
  message: string;
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

export type NotificationPreferenceRow = {
  id: string;
  profile_id: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  appointment_updates_enabled: boolean;
  points_updates_enabled: boolean;
  marketing_updates_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type EmailLogRow = {
  id: string;
  profile_id: string | null;
  notification_id: string | null;
  email_to: string;
  subject: string;
  template_key: string | null;
  status: EmailLogStatus;
  provider_message_id: string | null;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  recipientProfileId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export type NotificationPreference = {
  id: string;
  profileId: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  appointmentUpdatesEnabled: boolean;
  pointsUpdatesEnabled: boolean;
  marketingUpdatesEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EmailLog = EmailLogRow;
