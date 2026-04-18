import { NextResponse } from "next/server";

import { markNotificationReadSchema } from "@/features/notifications/schemas/notification.schema";
import { markNotificationAsRead } from "@/features/notifications/services/notification.service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = markNotificationReadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid notification id." }, { status: 400 });
  }

  const result = await markNotificationAsRead(parsed.data.notificationId);
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
