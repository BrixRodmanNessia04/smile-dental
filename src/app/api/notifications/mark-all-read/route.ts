import { NextResponse } from "next/server";

import { markAllNotificationsAsRead } from "@/features/notifications/services/notification.service";

export async function POST() {
  const result = await markAllNotificationsAsRead();
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
