import { NextResponse } from "next/server";

import { getMyNotificationsPayload } from "@/features/notifications/services/notification-query.service";
import { updateNotificationPreferencesSchema } from "@/features/notifications/schemas/notification.schema";
import { updateMyNotificationPreferences } from "@/features/notifications/services/notification.service";

export async function GET() {
  const result = await getMyNotificationsPayload();
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 401 });
  }

  return NextResponse.json(result.data.preferences);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = updateNotificationPreferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid preferences payload." }, { status: 400 });
  }

  const result = await updateMyNotificationPreferences(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
