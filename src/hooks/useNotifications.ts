"use client";

import { useCallback, useMemo, useState } from "react";

import type { NotificationsPayload } from "@/features/notifications/types";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import type { NotificationPreference } from "@/types/notification";

const EMPTY_PREFERENCES: NotificationPreference = {
  id: "",
  profileId: "",
  emailEnabled: true,
  inAppEnabled: true,
  appointmentUpdatesEnabled: true,
  pointsUpdatesEnabled: true,
  marketingUpdatesEnabled: false,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
};

type UseNotificationsOptions = {
  initialPayload?: NotificationsPayload | null;
};

export function useNotifications({ initialPayload }: UseNotificationsOptions = {}) {
  const [payload, setPayload] = useState<NotificationsPayload | null>(initialPayload ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/notifications", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.message || "Unable to load notifications.");
        return;
      }

      setPayload(data);
    } catch {
      setErrorMessage("Unable to load notifications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    setErrorMessage(null);

    const response = await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationId }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setErrorMessage(data?.message || "Unable to mark notification as read.");
      return;
    }

    setPayload((current) => {
      if (!current) {
        return current;
      }

      const notifications = current.notifications.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              isRead: true,
              readAt: notification.readAt ?? new Date().toISOString(),
            }
          : notification,
      );

      const unreadCount = notifications.reduce(
        (acc, notification) => acc + (notification.isRead ? 0 : 1),
        0,
      );

      return {
        ...current,
        notifications,
        unreadCount,
      };
    });
  }, []);

  const markAllAsRead = useCallback(async () => {
    setErrorMessage(null);

    const response = await fetch("/api/notifications/mark-all-read", {
      method: "POST",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setErrorMessage(data?.message || "Unable to mark all notifications as read.");
      return;
    }

    setPayload((current) => {
      if (!current) {
        return current;
      }

      const now = new Date().toISOString();
      const notifications = current.notifications.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt ?? now,
      }));

      return {
        ...current,
        notifications,
        unreadCount: 0,
      };
    });
  }, []);

  const updatePreferences = useCallback(
    async (input: {
      emailEnabled: boolean;
      inAppEnabled: boolean;
      appointmentUpdatesEnabled: boolean;
      pointsUpdatesEnabled: boolean;
      marketingUpdatesEnabled: boolean;
    }) => {
      setErrorMessage(null);

      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(data?.message || "Unable to update preferences.");
        return false;
      }

      setPayload((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          preferences: {
            ...current.preferences,
            emailEnabled: input.emailEnabled,
            inAppEnabled: input.inAppEnabled,
            appointmentUpdatesEnabled: input.appointmentUpdatesEnabled,
            pointsUpdatesEnabled: input.pointsUpdatesEnabled,
            marketingUpdatesEnabled: input.marketingUpdatesEnabled,
            updatedAt: new Date().toISOString(),
          },
        };
      });

      return true;
    },
    [],
  );

  const profileId = payload?.preferences.profileId ?? null;

  useRealtimeNotifications({
    profileId,
    onChange: refresh,
  });

  const derived = useMemo(
    () => ({
      notifications: payload?.notifications ?? [],
      unreadCount: payload?.unreadCount ?? 0,
      preferences: payload?.preferences ?? EMPTY_PREFERENCES,
    }),
    [payload],
  );

  return {
    ...derived,
    hasData: Boolean(payload),
    isLoading,
    errorMessage,
    refresh,
    markAsRead,
    markAllAsRead,
    updatePreferences,
  };
}
