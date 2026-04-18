import { NextResponse } from "next/server";

import { getMyNotificationsPayload } from "@/features/notifications/services/notification-query.service";

export async function GET() {
  const result = await getMyNotificationsPayload();

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 401 });
  }

  return NextResponse.json(result.data);
}
