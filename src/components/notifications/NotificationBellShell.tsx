"use client";

import UnreadCountBadge from "./UnreadCountBadge";

type NotificationBellShellProps = {
  unreadCount: number;
  onClick: () => void;
};

export default function NotificationBellShell({
  unreadCount,
  onClick,
}: NotificationBellShellProps) {
  return (
    <button
      aria-label="Open notifications"
      className="relative inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted"
      onClick={onClick}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M15 18h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v4.2a2 2 0 0 1-.6 1.4L4 18h5m6 0a3 3 0 1 1-6 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
      <span className="hidden sm:inline">Notifications</span>
      <UnreadCountBadge count={unreadCount} />
    </button>
  );
}
