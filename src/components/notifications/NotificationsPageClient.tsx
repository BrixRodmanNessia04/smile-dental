"use client";

import NotificationList from "@/components/notifications/NotificationList";
import type { NotificationsPayload } from "@/features/notifications/types";
import { useNotifications } from "@/hooks/useNotifications";

type NotificationsPageClientProps = {
  heading: string;
  initialPayload: NotificationsPayload | null;
  initialErrorMessage?: string;
};

export default function NotificationsPageClient({
  heading,
  initialPayload,
  initialErrorMessage,
}: NotificationsPageClientProps) {
  const {
    notifications,
    unreadCount,
    preferences,
    errorMessage,
    isLoading,
    markAsRead,
    markAllAsRead,
    updatePreferences,
  } = useNotifications({ initialPayload });

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">{heading}</h1>

      <p className="mt-2 text-sm text-slate-600">Unread: {unreadCount}</p>

      {initialErrorMessage || errorMessage ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMessage ?? initialErrorMessage}
        </p>
      ) : null}

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          className="space-y-4"
          key={`${preferences.profileId}:${preferences.updatedAt}`}
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            void updatePreferences({
              inAppEnabled: formData.get("inAppEnabled") === "on",
              emailEnabled: formData.get("emailEnabled") === "on",
              appointmentUpdatesEnabled:
                formData.get("appointmentUpdatesEnabled") === "on",
              pointsUpdatesEnabled: formData.get("pointsUpdatesEnabled") === "on",
              marketingUpdatesEnabled:
                formData.get("marketingUpdatesEnabled") === "on",
            });
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">Preferences</h2>
            <button
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
              disabled={isLoading}
              type="submit"
            >
              Save preferences
            </button>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <label className="flex items-center gap-2">
              <input
                defaultChecked={preferences.inAppEnabled}
                name="inAppEnabled"
                type="checkbox"
              />
              In-app notifications
            </label>
            <label className="flex items-center gap-2">
              <input
                defaultChecked={preferences.emailEnabled}
                name="emailEnabled"
                type="checkbox"
              />
              Email notifications
            </label>
            <label className="flex items-center gap-2">
              <input
                defaultChecked={preferences.appointmentUpdatesEnabled}
                name="appointmentUpdatesEnabled"
                type="checkbox"
              />
              Appointment updates
            </label>
            <label className="flex items-center gap-2">
              <input
                defaultChecked={preferences.pointsUpdatesEnabled}
                name="pointsUpdatesEnabled"
                type="checkbox"
              />
              Points updates
            </label>
            <label className="flex items-center gap-2">
              <input
                defaultChecked={preferences.marketingUpdatesEnabled}
                name="marketingUpdatesEnabled"
                type="checkbox"
              />
              Marketing updates
            </label>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">All notifications</h2>
          <button
            className="text-sm font-medium text-slate-900 underline disabled:opacity-60"
            disabled={unreadCount === 0 || isLoading}
            onClick={() => {
              void markAllAsRead();
            }}
            type="button"
          >
            Mark all read
          </button>
        </div>

        <NotificationList
          emptyMessage="No notifications yet."
          notifications={notifications}
          onMarkRead={markAsRead}
        />
      </section>
    </main>
  );
}
